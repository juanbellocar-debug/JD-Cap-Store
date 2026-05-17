import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getDb, productsTable } from "../_db";
import { setCors, requireAuth } from "../_auth";
import { eq } from "drizzle-orm";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);
  if (req.method === "OPTIONS") return res.status(200).end();

  const db = getDb();
  const id = Number(req.query.id);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid product id" });

  if (req.method === "GET") {
    try {
      const [product] = await db.select().from(productsTable).where(eq(productsTable.id, id));
      if (!product) return res.status(404).json({ error: "Product not found" });
      return res.json(product);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  if (req.method === "PUT") {
    const user = requireAuth(req, res);
    if (!user) return;

    try {
      const { name, brand, price, imageUrl, imageBackUrl, description, available, featured } = req.body;
      const update: Record<string, unknown> = {};
      if (name !== undefined) update.name = name;
      if (brand !== undefined) update.brand = brand;
      if (price !== undefined) update.price = Number(price);
      if (imageUrl !== undefined) update.imageUrl = imageUrl;
      if (imageBackUrl !== undefined) update.imageBackUrl = imageBackUrl;
      if (description !== undefined) update.description = description;
      if (available !== undefined) update.available = available;
      if (featured !== undefined) update.featured = featured;

      const [updated] = await db.update(productsTable).set(update).where(eq(productsTable.id, id)).returning();
      if (!updated) return res.status(404).json({ error: "Product not found" });
      return res.json(updated);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  if (req.method === "DELETE") {
    const user = requireAuth(req, res);
    if (!user) return;

    try {
      const [deleted] = await db.delete(productsTable).where(eq(productsTable.id, id)).returning({ id: productsTable.id });
      if (!deleted) return res.status(404).json({ error: "Product not found" });
      return res.json({ success: true });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
