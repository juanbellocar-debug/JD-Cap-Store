import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getDb, productsTable } from "../_db";
import { setCors, requireAuth } from "../_auth";
import { ilike, or } from "drizzle-orm";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);
  if (req.method === "OPTIONS") return res.status(200).end();

  const db = getDb();

  if (req.method === "GET") {
    try {
      const { brand, search } = req.query as { brand?: string; search?: string };

      if (brand && search) {
        const results = await db
          .select()
          .from(productsTable)
          .where(or(ilike(productsTable.brand, `%${brand}%`), ilike(productsTable.name, `%${search}%`)));
        return res.json(results);
      }
      if (brand) {
        return res.json(await db.select().from(productsTable).where(ilike(productsTable.brand, `%${brand}%`)));
      }
      if (search) {
        return res.json(
          await db.select().from(productsTable).where(or(ilike(productsTable.name, `%${search}%`), ilike(productsTable.brand, `%${search}%`)))
        );
      }
      return res.json(await db.select().from(productsTable));
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  if (req.method === "POST") {
    const user = requireAuth(req, res);
    if (!user) return;

    try {
      const { name, brand, price, imageUrl, imageBackUrl, description, available, featured } = req.body;
      if (!name || !brand || price == null) {
        return res.status(400).json({ error: "name, brand, and price are required" });
      }

      const [product] = await db
        .insert(productsTable)
        .values({
          name,
          brand,
          price: Number(price),
          imageUrl: imageUrl ?? "",
          imageBackUrl: imageBackUrl ?? null,
          description: description ?? null,
          available: available ?? true,
          featured: featured ?? false,
        })
        .returning();

      return res.status(201).json(product);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
