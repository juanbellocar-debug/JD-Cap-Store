import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getDb, productsTable } from "../_db";
import { setCors } from "../_auth";
import { eq } from "drizzle-orm";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);
  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method === "GET") {
    try {
      const db = getDb();
      const featured = await db
        .select()
        .from(productsTable)
        .where(eq(productsTable.featured, true))
        .limit(6);
      return res.json(featured);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
