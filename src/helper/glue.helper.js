import { makeS3service } from "../util/aws.util";
import { getAWSCredentials } from "../util/serverless.util";
import { readFileSync } from 'fs'
import GlueJob from "../domain/glue-job";
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
    async uploadGlueScriptToS3(fileScriptPath, bucket, keyPath = '') {

        let credentials = getAWSCredentials(this.serverless)
        let s3Service = makeS3service(credentials);

        let fileName = fileScriptPath.split('/').pop();

        let params = {
            Body: readFileSync(`./${fileScriptPath}`),
            Bucket: bucket,
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
        let jobs = [];
        for (let job of arrayJobsJSON) {
            let _job = job.job
            let glueJob = new GlueJob(_job.name, _job.script);
            let s3Url = await this.uploadGlueScriptToS3(_job.script, config.bucketDeploy, 'glueJobs/');
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
            if (_job.tempDir) {
                console.log("Cambiando a true");
                this.tempDir = true;
                glueJob.setTempDir({"Fn::Join": [
                    "",[
                        "s3://",
                        {"Ref" : "GlueJobTempBucket"},
                        `/${_job.name}`
                    ]
                ]})
            }
            jobs.push(glueJob);
        }
        return jobs;
    }



    async run() {
        let config = this.getPluginConfig();

        let jobs = await this.getGlueJobs(config);
        let template = this.serverless.service.provider.compiledCloudFormationTemplate.Resources;
        let outputs = this.serverless.service.provider.compiledCloudFormationTemplate.Outputs;
        this.serverless.cli.log("Building GlueJobs CloudFormation");
        for (let job of jobs) {
            template[toPascalCase(job.name)] = job.getCFGlueJob();
        }
        
        if (this.tempDir) {
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