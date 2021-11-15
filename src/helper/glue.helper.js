import { makeS3service } from "../util/aws.util";
import { getAWSCredentials } from "../util/serverless.util";
import { readFileSync } from 'fs'
import GlueJob from "../domain/glue-job";
import GlueTrigger from "../domain/glue-trigger";
import GlueTriggerAction from "../domain/glue-trigger-action";
import { toPascalCase } from '../util/string.util'

export default class GlueHelper {
    constructor(serverless) {
        this.serverless = serverless;
        this.tempDir = false;
    }


    /**
     * Upload Script to s3 bucket and return file destination
     * @param {string} fileScriptPath file path in proyect
     * @param {*} bucket bucket name
     * @param {*} keyPath key path in S3 Bucket
     */
    async uploadGlueScriptToS3(fileScriptPath, bucket, createBucket, keyPath = '') {

        let credentials = getAWSCredentials(this.serverless)
        let s3Service = makeS3service(credentials);

        let fileName = fileScriptPath.split('/').pop();

        let params = {
            Bucket: bucket
        }

        if (createBucket) {
            try {
                await s3Service.createBucket(params).promise();
            } catch (error) {
                if (!error.statuCode === 409) {
                    throw error;
                }
            }
        }


        let params = {
            ...params,
            Body: readFileSync(`./${fileScriptPath}`),
            Key: `${keyPath}${fileName}`
        }

        this.serverless.cli.log("Upload GlueJob Script to Bucket...");
        await s3Service.upload(params).promise();
        this.serverless.cli.log("Upload GlueJob Script to Bucket Done...");
        return `s3://${bucket}/${keyPath}${fileName}`
    }

    getPluginConfig() {
        return this.serverless.service.custom.Glue
    }

    /**
     * Get GlueJobs configured in serverless.yml
     * @param {Object} config plugin config
     */
    async getGlueJobs(config) {
        let arrayJobsJSON = config.jobs;
        let s3KeyPrefix = config.s3Prefix ? config.s3Prefix : 'glueJobs/';

        let tempDirBucket = config.tempDirBucket;
        let tempDirS3Prefix = config.tempDirS3Prefix;

        let jobs = [];
        for (let job of arrayJobsJSON) {
            let _job = job.job
            let glueJob = new GlueJob(_job.name, _job.script);
            let s3Url = await this.uploadGlueScriptToS3(_job.script, config.bucketDeploy, config.createBucket, s3KeyPrefix);
            glueJob.setS3ScriptLocation(s3Url);
            glueJob.setGlueVersion(_job.glueVersion);
            glueJob.setRole(_job.role);
            glueJob.setType(_job.type);
            glueJob.setCommandName(_job.type);
            if (_job.MaxConcurrentRuns) {
                glueJob.setMaxConcurrentRuns(_job.MaxConcurrentRuns)
            }
            if (_job.WorkerType) {
                glueJob.setWorkerType(_job.WorkerType);
            }
            if (_job.NumberOfWorkers) {
                glueJob.setNumberOfWorkers(_job.NumberOfWorkers)
            }
            if (_job.Connections) {
                glueJob.setConnections(_job.Connections)
            }
            if (_job.tempDir) {
                this.tempDir = true;

                // use the provided temp dir bucket if configured
                let jobTempDirBucket = tempDirBucket || { "Ref": "GlueJobTempBucket" };

                // use the provided s3 prefix if configured
                let jobTempDirS3Prefix = "";
                if (tempDirS3Prefix) {
                    jobTempDirS3Prefix += `/${tempDirS3Prefix}`
                }
                jobTempDirS3Prefix += `/${_job.name}`;

                glueJob.setTempDir({
                    "Fn::Join": [
                        "", ["s3://", jobTempDirBucket, jobTempDirS3Prefix]
                    ]
                })
            }

            jobs.push(glueJob);
        }
        return jobs;
    }

    /**
     * Get GlueJobTriggers configured in serverless.yml
     * @param {Object} config plugin config
     */
    async getGlueTriggers(config) {
        let triggers = [];
        try {
            let arrayTriggersJSON = config.triggers;

            for (let trigger of arrayTriggersJSON) {
                let _trigger = trigger.trigger;
                let glueTrigger = new GlueTrigger(_trigger.name, _trigger.schedule);
                let glueTriggerActions = []
                for (let job of _trigger.jobs) {
                    let _job = job.job;
                    const triggerAction = new GlueTriggerAction(_job.name);
                    if (_job.args) {
                        triggerAction.setArguments(_job.args);
                    }
                    if (_job.timeout) {
                        triggerAction.setTimeout(_job.timeout);
                    }
                    glueTriggerActions.push(triggerAction);
                }
                glueTrigger.setActions(glueTriggerActions);
                triggers.push(glueTrigger);
            }
        } catch (err) {
            console.log(`No Trigger configuration`);
        } finally {
            return triggers;
        }
    }

    async run() {
        let config = this.getPluginConfig();

        let jobs = await this.getGlueJobs(config);
        let triggers = await this.getGlueTriggers(config);

        let template = this.serverless.service.provider.compiledCloudFormationTemplate.Resources;
        let outputs = this.serverless.service.provider.compiledCloudFormationTemplate.Outputs;
        this.serverless.cli.log("Building GlueJobs CloudFormation");
        for (let job of jobs) {
            template[toPascalCase(job.name)] = job.getCFGlueJob();
        }
        for (let trigger of triggers) {
            template[toPascalCase(trigger.name)] = trigger.getCFGlueTrigger();
        }


        if (this.tempDir && !config.tempDirBucket) {
            this.serverless.cli.log("Building S3 Temp Bucket CloudFormation");
            let tempBucket = {
                "Type": "AWS::S3::Bucket",
                "Properties": {
                    "BucketName": `${this.serverless.service.service}-${this.serverless.service.provider.stage}-gluejobstemp`
                }
            }

            template[`GlueJobTempBucket`] = tempBucket;
            outputs[`GlueJobTempBucketName`] = { "Value": "GlueJobTempBucket" }
        }
    }
}
