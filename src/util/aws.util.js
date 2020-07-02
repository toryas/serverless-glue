import AWS from 'aws-sdk'

/**
 * Return a new S3 service
 * @param {*} credentials AWS Credentials
 */
export function makeS3service(credentials){
    return new AWS.S3({ credentials: credentials });
}