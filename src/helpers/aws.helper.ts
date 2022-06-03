import * as AWS from "aws-sdk";

export class AwsHelper {
  provider: any;
  s3: AWS.S3;

  constructor(serverless: any) {
    this.provider = serverless.getProvider("aws");
    this.s3 = AwsHelper.makeS3service(this.provider);
  }


  /**
   * Return a new S3 service
   * @param {*} credentials AWS Credentials
   */
  static makeS3service(provider: any) {
    const credentials = provider.getCredentials().credentials;
    const region = provider.options.region;
    return new AWS.S3({ credentials: credentials, region: region });
  }

  /**
   * create a S3 Bucket in AWS
   * @param options
   */
  async createBucket(options: AWS.S3.CreateBucketRequest) {
    await this.s3.createBucket(options).promise();
  }

  /**
   * Upload file to bucket
   * @param options
   */
  async uploadFileToS3(options: AWS.S3.PutObjectRequest) {
    if (!process.env.SLSGLUE_SKIP_UPLOADS) {
      await this.s3.upload(options).promise();
    }
  }

  existBucket(options: AWS.S3.CreateBucketRequest) {
    return new Promise((resolve, _rejects) => {
      this.s3.headBucket({ Bucket: options.Bucket }, (err, data) => {
        if (err) {
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });
  }
}
