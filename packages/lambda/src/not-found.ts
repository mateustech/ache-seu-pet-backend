import { Endpoint, Request, Response } from "@core/protocols";

export const main = Endpoint((req: Request, res: Response) => {
  return res.status(404).json({
    error: "NotFound",
    message: "The requested resource was not found in this server",
    path: req.getPath(),
    query: req.getQueryMap(),
    params: req.getParamMap(),
  });
});
