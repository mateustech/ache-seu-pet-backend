import { StackContext, Api, use } from "sst/constructs";
import { DynamoStack } from "./dynamo.stack";
import { BucketStack } from "./bucket.stack";

export function ApiStack({ stack }: StackContext) {
  const { PetTable } = use(DynamoStack);
  const { PetBucket } = use(BucketStack);

  const ApiGateway = new Api(stack, "PetApi", {
    defaults: {
      throttle: {
        burst: 25,
        rate: 10,
      },
    },
  });

  ApiGateway.setCors({
    allowMethods: ["ANY"],
    allowHeaders: ["*"],
    allowOrigins: ["*"],
    allowCredentials: false,
  });

  ApiGateway.bind([PetTable, PetBucket]);
  ApiGateway.attachPermissions(["dynamodb", "s3"]);
  ApiGateway.addRoutes(stack, {
    "ANY /{proxy+}": "packages/lambda/src/not-found.main",
  });

  stack.addOutputs({
    ApiEndpoint: ApiGateway.url,
    ApiCustomEndpoint: ApiGateway.customDomainUrl,
    ApiHttpArn: ApiGateway.httpApiArn,
    ApiStackName: stack.stackName,
  });

  return { ApiGateway };
}
