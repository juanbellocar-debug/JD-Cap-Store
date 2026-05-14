import { Router } from "express";
import { db } from "@workspace/db";
import { productsTable, brandsTable } from "@workspace/db";
import { eq, ilike, or } from "drizzle-orm";
import {
  ListProductsQueryParams,
  GetProductParams,
} from "@workspace/api-zod";

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

    let query = db.select().from(productsTable);

    if (brand && search) {
      const results = await db
        .select()
        .from(productsTable)
        .where(
          or(
            ilike(productsTable.brand, `%${brand}%`),
            ilike(productsTable.name, `%${search}%`)
          )
        );
      return res.json(results);
    }

    if (brand) {
      const results = await db
        .select()
        .from(productsTable)
        .where(ilike(productsTable.brand, `%${brand}%`));
      return res.json(results);
    }

    if (search) {
      const results = await db
        .select()
        .from(productsTable)
        .where(
          or(
            ilike(productsTable.name, `%${search}%`),
            ilike(productsTable.brand, `%${search}%`)
          )
        );
      return res.json(results);
    }

    const products = await db.select().from(productsTable);
    return res.json(products);
  } catch (err) {
    req.log.error({ err }, "Failed to list products");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/products/:id", async (req, res) => {
  try {
    const parsed = GetProductParams.safeParse({ id: Number(req.params.id) });
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid product id" });
    }

    const [product] = await db
      .select()
      .from(productsTable)
      .where(eq(productsTable.id, parsed.data.id));

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    return res.json(product);
  } catch (err) {
    req.log.error({ err }, "Failed to get product");
    res.status(500).json({ error: "Internal server error" });
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
