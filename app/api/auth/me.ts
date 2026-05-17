import type { VercelRequest, VercelResponse } from "@vercel/node";
import { setCors, requireAuth } from "../_auth";

export default function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const user = requireAuth(req, res);
  if (!user) return;

  return res.json({ id: user.userId, email: user.email });
}
