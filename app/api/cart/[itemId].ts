import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getDb, cartItemsTable, productsTable } from "../_db";
import { setCors } from "../_auth";
import { eq } from "drizzle-orm";

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
  if (req.method !== "DELETE") return res.status(405).json({ error: "Method not allowed" });

  const db = getDb();
  const itemId = Number(req.query.itemId);
  if (isNaN(itemId)) return res.status(400).json({ error: "Invalid item id" });

  try {
    const [item] = await db.select().from(cartItemsTable).where(eq(cartItemsTable.id, itemId));
    if (!item) return res.status(404).json({ error: "Cart item not found" });

    await db.delete(cartItemsTable).where(eq(cartItemsTable.id, itemId));
    return res.json(await buildCart(item.sessionId));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
