import { GlueJobInterface } from "./glue-job.interface";
import { GlueTriggerInterface } from "./glue-trigger.interface";

export interface GluePluginConfigInterface {
  bucketDeploy: string;
  s3Prefix?: string;
  tempDirBucket?: string;
  tempDirS3Prefix?: string;
  createBucket?:boolean;
  jobs?: GlueJobInterface[];
  triggers?:GlueTriggerInterface[];
}

