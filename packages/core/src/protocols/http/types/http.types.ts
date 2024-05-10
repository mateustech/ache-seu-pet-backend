import { APIGatewayEventRequestContextV2 } from "aws-lambda";

export type HttpQuery = Record<string, string | undefined>;
export type HttpParams = Record<string, string | undefined>;
export type HttpRequestHeaders = Record<
  string,
  string | number | boolean | undefined
>;
export type HttpResponseHeaders = Record<string, string | number | boolean>;
export type HttpRequestContext = APIGatewayEventRequestContextV2;

export type HttpContext = {
  method: string;
  path: string;
  protocol: string;
  sourceIp: string;
  userAgent: string;
};
