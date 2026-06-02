import { Router } from "express";
import {
  addToCart,
  getCart,
  removeFromCart,
  updateCartItem,
} from "../controllers/cart.controller";

const router = Router();

// 🛒 Add item to cart (upsert)
router.post("/add", addToCart);

// 📖 Get all cart items for a user (with product details)
router.get("/:userId", getCart);

// 🗑️ Remove a cart item by id
router.delete("/:id", removeFromCart);

// ✏️ Update quantity of a cart item
router.patch("/:id", updateCartItem);

export default router;
