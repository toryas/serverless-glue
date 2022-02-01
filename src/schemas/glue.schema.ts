export const GlueSchema = {
  type: "object",
  properties: {
    bucketDeploy: { type: "string" },
    createBucket: { type: "boolean" },
    s3Prefix: { type: "string" },
    tempDirBucket: { type: "string" },
    tempDirS3Prefix: { type: "string" },
  },
  required: ["bucketDeploy"],
};
