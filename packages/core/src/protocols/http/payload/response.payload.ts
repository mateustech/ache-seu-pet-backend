import { HttpResponseHeaders } from "src/protocols/http/types";
import { APIGatewayProxyStructuredResultV2 } from "aws-lambda";

export class Response {
  protected httpStatus: number = 200;
  protected httpHeaders: HttpResponseHeaders = {};
  protected httpPayload: string = "{}";

  constructor() {
    this.header("content-type", "text/plain; charset=UTF-8");
  }

  status(status: number): Response {
    this.httpStatus = status;
    return this;
  }

  header(name: string, value: string | number | boolean | undefined): Response {
    const headerName = name.toLowerCase();
    delete this.httpHeaders[headerName];
    if (value) {
      Object.assign(this.httpHeaders, { [headerName]: value });
    }
    return this;
  }

  get(name: string): string | number | boolean {
    const headerName = name.toLowerCase();
    return this.httpHeaders[headerName];
  }

  json<T extends object>(payload: T) {
    this.header("content-type", "application/json; charset=utf-8");
    this.httpPayload = JSON.stringify(payload, undefined, 2);
    return this;
  }

  raw(payload: string): Response {
    this.header("content-type", undefined);
    this.httpPayload = payload;
    return this;
  }

  toProxyResult(): APIGatewayProxyStructuredResultV2 {
    return {
      statusCode: this.httpStatus,
      headers: this.httpHeaders,
      body: this.httpPayload,
    };
  }
}
