import { VercelRequest, VercelResponse } from "@vercel/node";

const allowedOrigins = ["http://localhost:3000", "http://localhost:3001"];

export default function Cors(req: VercelRequest, res: VercelResponse, method: string): VercelResponse | void {
  const origin = req.headers.origin;

  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Methods", `${method}, OPTIONS`);
    return res
      .setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")
      .setHeader("Access-Control-Allow-Methods", `${method}, OPTIONS`)
      .status(200)
      .end();
  }
  // Return undefined when not handling OPTIONS request
  return undefined;
}
