import { GlueJob } from "../domain/glue-job";
import { GlueTrigger } from "../domain/glue-trigger";
import { GluePluginConfigInterface } from "../interfaces/glue-plugin-config.interce";
import { Global } from "../constants/global.constant";
import { SupportFile } from "../domain/support-files";

export class GlueHelper {
  constructor(private config: GluePluginConfigInterface) {}

  /**
   *  Return an array with al GlueJobs config in serverless yml file
   */
  getGlueJobs() {
    let jobs: GlueJob[] = [];
    if(!this.config.jobs){
      return jobs
    }
    for (let job of this.config.jobs) {
      let glueJob = new GlueJob(job);
      if (job.tempDir) {
        this.setTempBucketForJob(glueJob);
      }
      jobs.push(glueJob);
    }
    return jobs;
  }

  setTempBucketForJob(glueJob: GlueJob) {
    const jobTempDirBucket = this.config.tempDirBucket ?? {
      Ref: Global.GLUE_TEMP_BUCKET_REF,
    };
    let jobTempDirS3Prefix = "";
    if (this.config.tempDirS3Prefix) {
      jobTempDirS3Prefix += `/${this.config.tempDirS3Prefix}`;
    }
    jobTempDirS3Prefix += `/${glueJob.name}`;

    glueJob.DefaultArguments.tempDir = {
      "Fn::Join": ["", ["s3://", jobTempDirBucket, jobTempDirS3Prefix]],
    };
  }

  /**
   * Get GlueJobTriggers configured in serverless.yml
   * @param {Object} config plugin config
   */
  getGlueTriggers() {
    let triggers:GlueTrigger[] = [];
    if(!this.config.triggers){
      return triggers
    }
    for (let trigger of this.config.triggers) {
      let glueTrigger = new GlueTrigger(trigger);
      triggers.push(glueTrigger);
    }
    return triggers;
  }

  getSupportFiles(job: GlueJob) {
    let supportFiles:SupportFile[] = [];
    if(!job.SupportFiles){
      return supportFiles
    }   
    for (let supportFile of job.SupportFiles) {
      let glueSupportFile = new SupportFile(supportFile)
      supportFiles.push(glueSupportFile)
    }
    return supportFiles 
  }

}
