import { pgTable, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { user } from "./User.model";
import { product } from "./Products.model";

export const cartItem = pgTable("cart_items", {
  id: serial().primaryKey(),
  userId: integer("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  productId: integer("productId")
    .notNull()
    .references(() => product.id, { onDelete: "cascade" }),
  quantity: integer("quantity").notNull().default(1),
  createdAt: timestamp().defaultNow(),
  updatedAt: timestamp().defaultNow(),
});
