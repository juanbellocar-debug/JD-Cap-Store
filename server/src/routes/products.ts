import { Router } from "express";
import { db, productsTable, brandsTable } from "../db.js";
import { eq, ilike, or } from "drizzle-orm";
import {
  ListProductsQueryParams,
  GetProductParams,
  UpdateProductParams,
  DeleteProductParams,
  CreateProductBody,
  UpdateProductBody,
} from "../schemas.js";
import { requireAuth } from "./auth.js";

const router = Router();

router.get("/products/featured", async (req, res) => {
  try {
    const featured = await db
      .select()
      .from(productsTable)
      .where(eq(productsTable.featured, true))
      .limit(6);
    res.json(featured);
  } catch (err) {
    req.log.error({ err }, "Failed to get featured products");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/products", async (req, res) => {
  try {
    const parsed = ListProductsQueryParams.safeParse(req.query);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid query params" });
    }
    const { brand, search } = parsed.data;

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
        await db.select().from(productsTable).where(or(ilike(productsTable.name, `%${search}%`), ilike(productsTable.brand, `%${search}%`))),
      );
    }
    return res.json(await db.select().from(productsTable));
  } catch (err) {
    req.log.error({ err }, "Failed to list products");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/products/:id", async (req, res) => {
  try {
    const parsed = GetProductParams.safeParse({ id: Number(req.params.id) });
    if (!parsed.success) return res.status(400).json({ error: "Invalid product id" });

    const [product] = await db.select().from(productsTable).where(eq(productsTable.id, parsed.data.id));
    if (!product) return res.status(404).json({ error: "Product not found" });

    return res.json(product);
  } catch (err) {
    req.log.error({ err }, "Failed to get product");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/products", requireAuth, async (req, res) => {
  try {
    const parsed = CreateProductBody.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Invalid input" });

    const [product] = await db
      .insert(productsTable)
      .values({
        name: parsed.data.name,
        brand: parsed.data.brand,
        price: parsed.data.price,
        imageUrl: parsed.data.imageUrl ?? "",
        imageBackUrl: parsed.data.imageBackUrl ?? null,
        description: parsed.data.description ?? null,
        available: parsed.data.available ?? true,
        featured: parsed.data.featured ?? false,
      })
      .returning();
    return res.status(201).json(product);
  } catch (err) {
    req.log.error({ err }, "Failed to create product");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/products/:id", requireAuth, async (req, res) => {
  try {
    const paramsParsed = UpdateProductParams.safeParse({ id: Number(req.params.id) });
    if (!paramsParsed.success) return res.status(400).json({ error: "Invalid product id" });

    const bodyParsed = UpdateProductBody.safeParse(req.body);
    if (!bodyParsed.success) return res.status(400).json({ error: "Invalid input" });

    const { name, brand, price, imageUrl, imageBackUrl, description, available, featured } = bodyParsed.data;
    const updateData: Record<string, unknown> = {};
    if (name !== undefined) updateData.name = name;
    if (brand !== undefined) updateData.brand = brand;
    if (price !== undefined) updateData.price = price;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
    if (imageBackUrl !== undefined) updateData.imageBackUrl = imageBackUrl;
    if (description !== undefined) updateData.description = description;
    if (available !== undefined) updateData.available = available;
    if (featured !== undefined) updateData.featured = featured;

    const [updated] = await db
      .update(productsTable)
      .set(updateData)
      .where(eq(productsTable.id, paramsParsed.data.id))
      .returning();

    if (!updated) return res.status(404).json({ error: "Product not found" });
    return res.json(updated);
  } catch (err) {
    req.log.error({ err }, "Failed to update product");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/products/:id", requireAuth, async (req, res) => {
  try {
    const parsed = DeleteProductParams.safeParse({ id: Number(req.params.id) });
    if (!parsed.success) return res.status(400).json({ error: "Invalid product id" });

    const [deleted] = await db
      .delete(productsTable)
      .where(eq(productsTable.id, parsed.data.id))
      .returning({ id: productsTable.id });

    if (!deleted) return res.status(404).json({ error: "Product not found" });
    return res.json({ success: true });
  } catch (err) {
    req.log.error({ err }, "Failed to delete product");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/brands", async (_req, res) => {
  try {
    const brands = await db.select().from(brandsTable);
    res.json(brands);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
