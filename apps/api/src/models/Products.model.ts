import { pgTable, serial, text, integer, timestamp, } from "drizzle-orm/pg-core";

export const product = pgTable("products", {
  id: serial().primaryKey(),
  name: text().notNull(),
  description: text().notNull(),
  price: text().notNull(),
  categories:text().notNull(),
  productImage: text("productImage").notNull(), // Cloudinary image URL
  createdAt: timestamp().defaultNow(),
  updatedAt: timestamp().defaultNow(),

});