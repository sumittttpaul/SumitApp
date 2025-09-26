import { VercelRequest, VercelResponse } from "@vercel/node";
import rateLimit from "express-rate-limit";
import logging from "./logging";
import Cors from "./cors";

export const applyCors = async (req: VercelRequest, res: VercelResponse): Promise<void | VercelResponse> => {
  return Cors(req, res, "POST");
};

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per windowMs
  message: { error: "Too many request, please wait." },
  standardHeaders: true,
  legacyHeaders: false,
});

export const applyRateLimit = (req: VercelRequest, res: VercelResponse) => {
  return new Promise<void>((resolve, reject) => {
    limiter(req as any, res as any, (err: any) => {
      if (err) return reject(err);
      resolve();
    });
  });
};

export const checkMethod = (allowedMethod: "POST" | "GET" | "PUT" | "DELETE") => {
  return async (req: VercelRequest, res: VercelResponse): Promise<void | VercelResponse> => {
    if (req.method !== allowedMethod) {
      logging.error(`Method Not Allowed: Expected ${allowedMethod}, got ${req.method}`);
      return res.status(405).json({ error: "Method Not Allowed." });
    }
    // Return undefined when method is allowed (no early termination needed)
    return undefined;
  };
};
