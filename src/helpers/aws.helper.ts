import * as AWS from 'aws-sdk';


export class AwsHelper {
  credentials: AWS.Credentials;
  s3: AWS.S3;

  constructor(serverless: any) {
    this.credentials = AwsHelper.getAWSCredentials(serverless);
    this.s3 = AwsHelper.makeS3service(this.credentials);
  }

  /**
   * Return AWS credentials from serverless framework
   * @param {Object} serverless Serverless Framework Object
   */
  static getAWSCredentials(serverless: any): AWS.Credentials {
    let provider = serverless.getProvider("aws");
    return provider.getCredentials().credentials;
  }

  /**
   * Return a new S3 service
   * @param {*} credentials AWS Credentials
   */
  static makeS3service(credentials: AWS.Credentials) {
    return new AWS.S3({ credentials: credentials });
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
    if(!process.env.SLSGLUE_SKIP_UPLOADS){
      await this.s3.upload(options).promise();
    }
  }
}
