import { APIGatewayProxyEventV2, Context } from "aws-lambda";
import {
  HttpContext,
  HttpQuery,
  HttpParams,
  HttpRequestHeaders,
  HttpRequestContext,
} from "src/protocols/http/types";

export class Request {
  constructor(
    protected readonly event: APIGatewayProxyEventV2,
    protected readonly context: Context
  ) {}

  getRequestContext(): HttpRequestContext {
    return this.event.requestContext;
  }

  getHttpContext(): HttpContext {
    return this.getRequestContext().http;
  }

  getMethod(): string {
    return this.getHttpContext().method;
  }

  getPath(): string {
    return this.getHttpContext().path;
  }

  getQueryMap(): HttpQuery {
    return this.event.queryStringParameters ?? {};
  }

  getParamMap(): HttpParams {
    return this.event.pathParameters ?? {};
  }

  getHeaderMap(): HttpRequestHeaders {
    return this.event.headers ?? {};
  }

  query(name: string): string | undefined {
    return this.getQueryMap()[name];
  }

  param(name: string): string | undefined {
    return this.getParamMap()[name];
  }

  header(name: string): string | number | boolean | undefined {
    return this.getHeaderMap()[name];
  }

  getBody(): string {
    return this.event.body ?? "";
  }

  getJson<T>(): T | undefined {
    try {
      const contentType = this.header("content-type");
      const isJsonBody =
        contentType && String(contentType).includes("application/json");

      return isJsonBody ? JSON.parse(this.getBody()) : undefined;
    } catch (e) {
      return undefined;
    }
  }
}
