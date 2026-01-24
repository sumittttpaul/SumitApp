import { VercelRequest } from "@vercel/node";

const getValidatedUpdates = (req: VercelRequest): Record<string, unknown> | null => {
  const { updates }: { updates?: unknown } = req.body as { updates?: unknown };
  if (!updates || typeof updates !== "object" || Object.keys(updates).length === 0) return null;
  return updates as Record<string, unknown>;
};

export default getValidatedUpdates;
