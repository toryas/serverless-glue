export interface CreateBucketConfigInterface {
  ACL?: string;
  CreateBucketConfiguration?: LocationConstraintInterface;
  GrantFullControl?: string;
  GrantRead?: string;
  GrantReadACP?: string;
  GrantWrite?: string;
  GrantWriteACP?: string;
  ObjectLockEnabledForBucket?: boolean;
  ObjectOwnership?: string;
  LocationConstraint?: string;
}

interface LocationConstraintInterface {
  LocationConstraint: string;
}
