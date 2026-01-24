import { VercelResponse } from "@vercel/node";
import logging from "./logging";

const sendError = (res: VercelResponse, message: string, statusCode: number = 500) => {
  logging.error(message);
  return res.status(statusCode).json({ error: message, statusCode });
};

export default sendError;
