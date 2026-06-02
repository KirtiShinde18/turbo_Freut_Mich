import { Request, Response } from "express";
import db from "../config/db";
import { cartItem, product, user } from "../models";
import { eq, and } from "drizzle-orm";
import { ADD_TO_CART_REQUEST, GET_CART_RESPONSE, COMMON_RESPONSE } from "@repo/types";

// ----------------------------- 🛒 ADD TO CART -----------------------------

export const addToCart = async (
  req: Request<{}, {}, ADD_TO_CART_REQUEST>,
  res: Response<COMMON_RESPONSE>
): Promise<void> => {
  try {
    const { userId, productId, quantity } = req.body;

    // Check if item already exists in cart for this user
    const [existing] = await db
      .select()
      .from(cartItem)
      .where(and(eq(cartItem.userId, userId), eq(cartItem.productId, productId)));

    if (existing) {
      // ✅ Already in cart → increment quantity
      await db
        .update(cartItem)
        .set({ quantity: existing.quantity + quantity })
        .where(eq(cartItem.id, existing.id));

      res.status(200).json({ message: "Cart quantity updated ✨" });
    } else {
      // ✅ Not in cart → insert new row
      await db.insert(cartItem).values({ userId, productId, quantity });
      res.status(201).json({ message: "Item added to cart 🛒" });
    }
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// ----------------------------- 📖 GET CART BY USER -----------------------------

export const getCart = async (
  req: Request<{ userId: string }>,
  res: Response<GET_CART_RESPONSE | COMMON_RESPONSE>
): Promise<void> => {
  try {
    const userId = Number(req.params.userId);

    const result = await db
      .select({
        id: cartItem.id,
        userId: cartItem.userId,
        productId: cartItem.productId,
        quantity: cartItem.quantity,
        createdAt: cartItem.createdAt,
        updatedAt: cartItem.updatedAt,
        product: {
          id: product.id,
          name: product.name,
          price: product.price,
          productImage: product.productImage,
          description: product.description,
          categories: product.categories,
        },
      })
      .from(cartItem)
      .innerJoin(product, eq(cartItem.productId, product.id))
      .where(eq(cartItem.userId, userId));

    res.status(200).json({ result: result as any });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// ----------------------------- 🗑️ REMOVE FROM CART -----------------------------

export const removeFromCart = async (
  req: Request<{ id: string }>,
  res: Response<COMMON_RESPONSE>
): Promise<void> => {
  try {
    const id = Number(req.params.id);

    await db.delete(cartItem).where(eq(cartItem.id, id));

    res.status(200).json({ message: "Item removed from cart 🗑️" });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// ----------------------------- ✏️ UPDATE CART QUANTITY -----------------------------

export const updateCartItem = async (
  req: Request<{ id: string }, {}, { quantity: number }>,
  res: Response<COMMON_RESPONSE>
): Promise<void> => {
  try {
    const id = Number(req.params.id);
    const { quantity } = req.body;

    if (quantity < 1) {
      // If quantity drops to 0, remove the item
      await db.delete(cartItem).where(eq(cartItem.id, id));
      res.status(200).json({ message: "Item removed from cart 🗑️" });
      return;
    }

    await db
      .update(cartItem)
      .set({ quantity })
      .where(eq(cartItem.id, id));

    res.status(200).json({ message: "Cart updated ✨" });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
