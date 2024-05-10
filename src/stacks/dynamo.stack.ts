import { StackContext } from "sst/constructs";
import { TableBuilder, PetSchema } from "src/database";

export function DynamoStack({ stack }: StackContext) {
  const PetTable = TableBuilder.create("PetDynamoDb")
    .withScope(stack)
    .withSchema(PetSchema)
    .build();

  stack.addOutputs({
    DynamoTableName: PetTable.tableName,
    DynamoTableArn: PetTable.tableArn,
    DynamoStackName: stack.stackName,
  });

  return { PetTable };
}
