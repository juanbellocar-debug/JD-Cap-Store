import jwt from "jsonwebtoken";
import type { VercelRequest, VercelResponse } from "@vercel/node";

function getSecret(): string {
  const s = process.env.SESSION_SECRET;
  if (!s) throw new Error("SESSION_SECRET is required");
  return s;
}

export function signToken(payload: { userId: number; email: string }): string {
  return jwt.sign(payload, getSecret(), { expiresIn: "7d" });
}

export function verifyToken(token: string): { userId: number; email: string } {
  return jwt.verify(token, getSecret()) as { userId: number; email: string };
}

export function getTokenFromRequest(req: VercelRequest): string | null {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) return null;
  return auth.slice(7);
}

export function setCors(res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
}

export function requireAuth(
  req: VercelRequest,
  res: VercelResponse
): { userId: number; email: string } | null {
  const token = getTokenFromRequest(req);
  if (!token) {
    res.status(401).json({ error: "Unauthorized" });
    return null;
  }
  try {
    return verifyToken(token);
  } catch {
    res.status(401).json({ error: "Unauthorized" });
    return null;
  }
}
