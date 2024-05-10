import { APIGatewayProxyEventV2, Context } from "aws-lambda";
import { Request } from "src/protocols/http/payload";

export class RequestBuilder {
  private context!: Context;
  private event!: APIGatewayProxyEventV2;

  withEvent(event: APIGatewayProxyEventV2) {
    this.event = event;
    return this;
  }

  withContext(context: Context) {
    this.context = context;
    return this;
  }

  build() {
    return new Request(this.event, this.context);
  }
}
