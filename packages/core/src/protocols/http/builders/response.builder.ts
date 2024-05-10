import { Response } from "src/protocols/http/payload";

export class ResponseBuilder {
  build(): Response {
    return new Response();
  }
}
