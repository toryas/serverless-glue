/**
 * Return AWS credentials from serverless framework
 * @param {Object} serverless Serverless Framework Object
 */
export function getAWSCredentials(serverless) {
    let provider = serverless.getProvider('aws');
    return provider.getCredentials().credentials;
}
