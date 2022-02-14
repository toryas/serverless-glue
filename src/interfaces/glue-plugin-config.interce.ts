import { CreateBucketConfigInterface } from "./create-bucket-config.interface";
import { GlueJobInterface } from "./glue-job.interface";
import { GlueTriggerInterface } from "./glue-trigger.interface";

export interface GluePluginConfigInterface {
  bucketDeploy: string;
  s3Prefix?: string;
  tempDirBucket?: string;
  tempDirS3Prefix?: string;
  createBucket?:boolean;
  createBucketConfig?: CreateBucketConfigInterface;
  jobs?: GlueJobInterface[];
  triggers?:GlueTriggerInterface[];
}

