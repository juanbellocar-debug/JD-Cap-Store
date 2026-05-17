import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getDb, cartItemsTable, productsTable } from "../_db";
import { setCors } from "../_auth";
import { eq, and } from "drizzle-orm";

async function buildCart(sessionId: string) {
  const db = getDb();
  const items = await db
    .select({
      id: cartItemsTable.id,
      productId: cartItemsTable.productId,
      quantity: cartItemsTable.quantity,
      productName: productsTable.name,
      productBrand: productsTable.brand,
      price: productsTable.price,
      imageUrl: productsTable.imageUrl,
    })
    .from(cartItemsTable)
    .innerJoin(productsTable, eq(cartItemsTable.productId, productsTable.id))
    .where(eq(cartItemsTable.sessionId, sessionId));

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return { sessionId, items, total };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);
  if (req.method === "OPTIONS") return res.status(200).end();

  const db = getDb();

  if (req.method === "GET") {
    const sessionId = req.query.sessionId as string;
    if (!sessionId) return res.status(400).json({ error: "sessionId is required" });
    try {
      return res.json(await buildCart(sessionId));
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  if (req.method === "POST") {
    try {
      const { sessionId, productId, quantity = 1 } = req.body ?? {};
      if (!sessionId || !productId) return res.status(400).json({ error: "sessionId and productId are required" });

      const [existing] = await db
        .select()
        .from(cartItemsTable)
        .where(and(eq(cartItemsTable.sessionId, sessionId), eq(cartItemsTable.productId, Number(productId))));

      if (existing) {
        await db.update(cartItemsTable).set({ quantity: existing.quantity + Number(quantity) }).where(eq(cartItemsTable.id, existing.id));
      } else {
        await db.insert(cartItemsTable).values({ sessionId, productId: Number(productId), quantity: Number(quantity) });
      }

      return res.json(await buildCart(sessionId));
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
