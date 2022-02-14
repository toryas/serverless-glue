import { readFileSync } from "fs";
import { Global } from "../constants/global.constant";
import { GlueJob } from "../domain/glue-job";
import { GlueTrigger } from "../domain/glue-trigger";
import { SupportFile } from "../domain/support-files";
import { AwsHelper } from "../helpers/aws.helper";
import { GlueHelper } from "../helpers/glue.helper";
import { ServerlessHelper } from "../helpers/serverless.helper";
import { GluePluginConfigInterface } from "../interfaces/glue-plugin-config.interce";
import { CloudFormationUtils } from "../utils/cloud-formation.utils";
import { StringUtils } from "../utils/string.utils";
import fs from "fs";

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
    if (!this.config) {
      this.helperless.log("Glue Config Not Found.");
      return;
    }
    if (this.config) {
      this.helperless.log("Glue config detected.");
      await this.processGlueJobs();
      this.processTriggers();
    } else {
      this.helperless.log("Glue config not detected.");
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
      let params = {
        Bucket: this.config.bucketDeploy,
      };

      if (this.config?.createBucketConfig) {
        if (this.config?.createBucketConfig.LocationConstraint) {
          this.config.createBucketConfig.CreateBucketConfiguration = {
            LocationConstraint:
              this.config?.createBucketConfig.LocationConstraint,
          };
          delete this.config?.createBucketConfig.LocationConstraint;
        }
        params = {
          ...params,
          ...this.config.createBucketConfig,
        };
      }

      await this.awsHelper.createBucket(params);
    }

    for (const job of jobs) {
      await this.uploadJobScripts(job);
      await this.uploadSupportFiles(job);
      const jobCFTemplate = CloudFormationUtils.glueJobToCF(job);
      this.helperless.appendToTemplate(
        "resources",
        StringUtils.toPascalCase(job.name),
        jobCFTemplate
      );
    }

    if (
      jobs.filter((e) => e.tempDir).length > 0 &&
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
    if (!this.config) throw new Error("Glue Config not found.");
    const fileName = job.scriptPath.split("/").pop();
    const params = {
      Bucket: this.config.bucketDeploy,
      Body: readFileSync(`./${job.scriptPath}`),
      Key: `${this.config?.s3Prefix}${fileName}`,
    };
    await this.awsHelper.uploadFileToS3(params);
    job.setScriptS3Location(`s3://${params.Bucket}/${params.Key}`);
  }

  async uploadSupportFiles(job: GlueJob) {
    if (!job.SupportFiles) {
      return;
    }
    this.helperless.log("Support Files found.");
    this.helperless.log("Proccessing Support Files.");
    let supportFiles = this.glueHelper.getSupportFiles(job);

    supportFiles.forEach(async (supportFile: SupportFile) => {
      if (
        supportFile.local_path == null ||
        supportFile.s3_bucket == null ||
        supportFile.s3_prefix == null ||
        supportFile.execute_upload == null
      ) {
        throw new Error("Please provide all parameters for SupportFiles.");
      }

      if (!supportFile.execute_upload) {
        this.helperless.log(`Skipping upload for: ${supportFile.local_path}`);
      }

      if (supportFile.execute_upload) {
        if (fs.lstatSync(supportFile.local_path).isFile()) {
          this.helperless.log(`Uploading file: ${supportFile.local_path}`);
          let filename = require("path").basename(supportFile.local_path);
          const params = {
            Bucket: supportFile.s3_bucket,
            Body: readFileSync(supportFile.local_path),
            Key: `${supportFile.s3_prefix}${filename}`,
          };
          this.awsHelper.uploadFileToS3(params);
          this.helperless.log(
            `Uploaded '${filename}' in s3://${params.Bucket}/${params.Key}`
          );
        }

        if (fs.lstatSync(supportFile.local_path).isDirectory()) {
          this.helperless.log(
            `Uploading all files in: ${supportFile.local_path}`
          );
          fs.readdirSync(supportFile.local_path).forEach((filename) => {
            const params = {
              Bucket: supportFile.s3_bucket,
              Body: readFileSync(`${supportFile.local_path}/${filename}`),
              Key: `${supportFile.s3_prefix}${filename}`,
            };
            this.awsHelper.uploadFileToS3(params);
            this.helperless.log(
              `Uploaded '${filename}' in s3://${params.Bucket}/${params.Key}`
            );
          });
        }
      }
    });
  }
}
