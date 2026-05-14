import { Router } from "express";
import { db } from "@workspace/db";
import { cartItemsTable, productsTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { GetCartQueryParams, AddToCartBody, RemoveFromCartParams } from "@workspace/api-zod";

const router = Router();

async function buildCart(sessionId: string) {
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

  return {
    sessionId,
    items,
    total,
  };
}

router.get("/cart", async (req, res) => {
  try {
    const parsed = GetCartQueryParams.safeParse(req.query);
    if (!parsed.success) {
      return res.status(400).json({ error: "sessionId is required" });
    }
    const cart = await buildCart(parsed.data.sessionId);
    return res.json(cart);
  } catch (err) {
    req.log.error({ err }, "Failed to get cart");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/cart", async (req, res) => {
  try {
    const parsed = AddToCartBody.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid cart item" });
    }
    const { sessionId, productId, quantity } = parsed.data;

    const [existing] = await db
      .select()
      .from(cartItemsTable)
      .where(
        and(
          eq(cartItemsTable.sessionId, sessionId),
          eq(cartItemsTable.productId, productId)
        )
      );

    if (existing) {
      await db
        .update(cartItemsTable)
        .set({ quantity: existing.quantity + quantity })
        .where(eq(cartItemsTable.id, existing.id));
    } else {
      await db.insert(cartItemsTable).values({ sessionId, productId, quantity });
    }

    const cart = await buildCart(sessionId);
    return res.json(cart);
  } catch (err) {
    req.log.error({ err }, "Failed to add to cart");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/cart/:itemId", async (req, res) => {
  try {
    const parsed = RemoveFromCartParams.safeParse({ itemId: Number(req.params.itemId) });
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid item id" });
    }

    const [item] = await db
      .select()
      .from(cartItemsTable)
      .where(eq(cartItemsTable.id, parsed.data.itemId));

    if (!item) {
      return res.status(404).json({ error: "Cart item not found" });
    }

    await db.delete(cartItemsTable).where(eq(cartItemsTable.id, parsed.data.itemId));

    const cart = await buildCart(item.sessionId);
    return res.json(cart);
  } catch (err) {
    req.log.error({ err }, "Failed to remove from cart");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
