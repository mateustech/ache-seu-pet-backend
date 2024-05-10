import { ApiHandler } from "sst/node/api";
import { APIGatewayProxyEventV2, Context } from "aws-lambda";
import { Response } from "src/protocols/http/payload";
import { RequestBuilder, ResponseBuilder } from "src/protocols/http/builders";
import {
  EndpointEventHandler,
  EndpointHandler,
} from "src/protocols/http/types";

export function Endpoint<T extends object>(
  handler: EndpointHandler<T>
): EndpointEventHandler {
  return ApiHandler(async (event: APIGatewayProxyEventV2, context: Context) => {
    const response = new ResponseBuilder().build();
    const request = new RequestBuilder()
      .withContext(context)
      .withEvent(event)
      .build();

    const payload = await handler(request, response);

    if (payload && !(payload instanceof Response)) {
      response.json<T>(payload);
    }

    return response.toProxyResult();
  });
}
