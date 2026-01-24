import { VercelRequest, VercelResponse } from "@vercel/node";

type Middleware = (req: VercelRequest, res: VercelResponse) => Promise<void | VercelResponse>;
type Handler = (req: VercelRequest, res: VercelResponse) => Promise<VercelResponse>;

export default function withMiddleware(handler: Handler, middlewares: Middleware[]) {
  return async (req: VercelRequest, res: VercelResponse): Promise<VercelResponse | void> => {
    for (const middleware of middlewares) {
      const response = await middleware(req, res);
      if (response) return response;
    }
    return handler(req, res);
  };
}
