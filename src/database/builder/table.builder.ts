import { Construct } from "constructs";
import { Table, TableProps } from "sst/constructs";

export class TableBuilder {
  private scope?: Construct;
  private schema?: TableProps;

  private constructor(private readonly id: string) {}

  static create(id: string): TableBuilder {
    return new TableBuilder(id);
  }

  withScope(scope: Construct): TableBuilder {
    this.scope = scope;
    return this;
  }

  withSchema(schema: TableProps): TableBuilder {
    this.schema = schema;
    return this;
  }

  build(): Table {
    return new Table(this.scope!, this.id, this.schema!);
  }
}
