import { Bucket, StackContext } from "sst/constructs";

export function BucketStack({ stack }: StackContext) {
  const PetBucket = new Bucket(stack, "PetBucket");

  stack.addOutputs({
    BucketArn: PetBucket.bucketArn,
    BucketName: PetBucket.bucketName,
    BucketStackName: stack.stackName,
  });

  return { PetBucket };
}
