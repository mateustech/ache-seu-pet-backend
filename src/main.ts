import { SSTConfig } from "sst";
import { ApiStack, BucketStack, DynamoStack } from "src/stacks";

export const SstConfig: SSTConfig = {
  config(input) {
    return {
      name: "ache-seu-pet",
      region: "us-east-1",
    };
  },
  stacks(app) {
    app.stack(DynamoStack).stack(BucketStack).stack(ApiStack);

    app.setDefaultRemovalPolicy("destroy");
    app.setDefaultFunctionProps({
      tracing: "disabled",
      runtime: "nodejs18.x",
      architecture: "arm_64",
      memorySize: "128 MB",
      timeout: "10 seconds",
    });
  },
};
