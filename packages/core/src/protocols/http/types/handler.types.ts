import { Request, Response } from "src/protocols/http/payload";
import {
  APIGatewayProxyEventV2,
  APIGatewayProxyStructuredResultV2,
  Context,
} from "aws-lambda";

export type EndpointHandler<T extends object> = (
  req: Request,
  res: Response
) => void | T | Promise<void> | Promise<T>;

export type EndpointEventHandler = (
  event: APIGatewayProxyEventV2,
  context: Context
) => Promise<APIGatewayProxyStructuredResultV2>;
