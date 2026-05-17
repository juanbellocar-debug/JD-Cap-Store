import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import {
  pgTable,
  text,
  serial,
  boolean,
  doublePrecision,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";

let _pool: Pool | null = null;

function getPool(): Pool {
  if (!_pool) {
    if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required");
    _pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 1 });
  }
  return _pool;
}

export const brandsTable = pgTable("brands", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  logoUrl: text("logo_url"),
});

export const productsTable = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  brand: text("brand").notNull(),
  price: doublePrecision("price").notNull(),
  imageUrl: text("image_url").notNull(),
  imageBackUrl: text("image_back_url"),
  description: text("description"),
  available: boolean("available").notNull().default(true),
  featured: boolean("featured").notNull().default(false),
});

export const cartItemsTable = pgTable("cart_items", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  productId: integer("product_id")
    .notNull()
    .references(() => productsTable.id),
  quantity: integer("quantity").notNull().default(1),
});

export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

const schema = { brandsTable, productsTable, cartItemsTable, usersTable };

export function getDb() {
  return drizzle(getPool(), { schema });
}

export type Product = typeof productsTable.$inferSelect;
export type Brand = typeof brandsTable.$inferSelect;
export type CartItem = typeof cartItemsTable.$inferSelect;
export type User = typeof usersTable.$inferSelect;
