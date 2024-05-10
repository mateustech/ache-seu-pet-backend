import { Bucket, StackContext } from "sst/constructs";

export function BucketStack({ stack }: StackContext) {
  const PetBucket = new Bucket(stack, "PetBucket");
  return { PetBucket };
}
