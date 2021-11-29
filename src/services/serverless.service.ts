import { readFileSync } from "fs";
import { Global } from "../constants/global.constant";
import { GlueJob } from "../domain/glue-job";
import { GlueTrigger } from "../domain/glue-trigger";
import { AwsHelper } from "../helpers/aws.helper";
import { GlueHelper } from "../helpers/glue.helper";
import { ServerlessHelper } from "../helpers/serverless.helper";
import { GluePluginConfigInterface } from "../interfaces/glue-plugin-config.interce";
import { CloudFormationUtils } from "../utils/cloud-formation.utils";
import { StringUtils } from "../utils/string.utils";

export class ServerlessService {
  awsHelper: AwsHelper;
  glueHelper: GlueHelper;
  config?: GluePluginConfigInterface;
  helperless: ServerlessHelper;
  constructor(private serverless: any) {
    this.helperless = new ServerlessHelper(this.serverless);
    this.config = this.helperless.getPluginConfig();
    this.awsHelper = new AwsHelper(this.serverless);
    this.glueHelper = new GlueHelper(this.config);
  }

  async main() {
    if(!this.config){
      this.helperless.log("Glue Config Not Found.")
      return;
    }
    if (this.config) {
      this.helperless.log("Glue config detected.");
      await this.processGlueJobs();
      this.processTriggers();
    } else {
      this.helperless.log("Glle config not detected.");
    }
  }
  async processGlueJobs() {
    if (!this.config?.jobs) {
      this.helperless.log("Jobs not found.");
      return;
    }
    this.helperless.log("Proccessing Jobs.");
    let jobs = this.glueHelper.getGlueJobs();
    if (this.config?.createBucket) {
      const params = {
        Bucket: this.config.bucketDeploy,
      };
      await this.awsHelper.createBucket(params);
    }
    jobs.forEach(async (job: GlueJob) => {
      await this.uploadJobScripts(job);
      const jobCFTemplate = CloudFormationUtils.glueJobToCF(job);
      this.helperless.appendToTemplate(
        "resources",
        StringUtils.toPascalCase(job.name),
        jobCFTemplate
      );
    });

    if (
      jobs.filter((e) => e.tempDirRef == true).length > 0 &&
      !this.config?.tempDirBucket
    ) {
      const bucketTemplate = CloudFormationUtils.generateBucketTemplate(
        `GlueTempBucket-${StringUtils.randomString(8)}`
      );
      this.helperless.appendToTemplate(
        "resources",
        Global.GLUE_TEMP_BUCKET_REF,
        bucketTemplate
      );
      this.helperless.appendToTemplate("outputs", "GlueJobTempBucketName", {
        Value: Global.GLUE_TEMP_BUCKET_REF,
      });
    }
  }

  processTriggers() {
    if (!this.config?.triggers) {
      this.helperless.log("Triggers not found.");
      return;
    }
    this.helperless.log("Proccessing Triggers.");
    let triggers = this.glueHelper.getGlueTriggers();
    triggers.forEach((trigger: GlueTrigger) => {
      const triggerCFTemplate = CloudFormationUtils.glueTriggerToCF(trigger);
      this.helperless.appendToTemplate(
        "resources",
        StringUtils.toPascalCase(trigger.name),
        triggerCFTemplate
      );
    });
  }

  async uploadJobScripts(job: GlueJob) {
    if(!this.config) throw new Error("Gle Config not found.");
    const fileName = job.scriptPath.split("/").pop();
    const params = {
      Bucket: this.config.bucketDeploy,
      Body: readFileSync(`./${job.scriptPath}`),
      Key: `${this.config?.s3Prefix}${fileName}`,
    };
    await this.awsHelper.uploadFileToS3(params);
    job.setScriptS3Location(`s3://${params.Bucket}/${params.Key}`);
  }
}
