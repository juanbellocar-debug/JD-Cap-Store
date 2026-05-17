import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getDb, brandsTable } from "../_db";
import { setCors } from "../_auth";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);
  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method === "GET") {
    try {
      const db = getDb();
      const brands = await db.select().from(brandsTable);
      return res.json(brands);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
