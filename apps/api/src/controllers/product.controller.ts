import { COMMON_RESPONSE, CREATE_PRODUCT_REQUEST, Product } from "@repo/types";
import { Request, Response } from "express";
import cloud from "../utils/cloud";
import db from "../config/db";
import { product } from "../models";
import { eq } from "drizzle-orm";

// ----------------------------- 🚀 ADD PRODUCT -----------------------------

// 🚀 ADD PRODUCT
export const createProduct = async ( req: Request<{}, {}, CREATE_PRODUCT_REQUEST>, res: Response<COMMON_RESPONSE | { product: Product }> ): Promise<void> => {

  try {

    // 📁 Check image exists
    if (!req.file) {
      res.status(400).json({ message: "Product image is required",});
      return;
    }

    // ☁️ Upload image to Cloudinary
    const { secure_url } =
      await cloud.uploader.upload( req.file.path );

    // 📦 Extract frontend data
    const { name, description, categories, price, } = req.body;

    // 💾 Save in PostgreSQL
    const newProduct = await db
      .insert(product)
      .values({
        name,
        description,
        categories,
        price,
        productImage: secure_url,
      })
      .returning();

    // ✅ Success response
    res.status(201).json({ message: "Product created successfully 🚀", product: newProduct[0], });

  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: error.message,});
  }
};


// ----------------------------- 📖 RAED -----------------------------
export const getProduct = async ( req: Request, res: Response ): Promise<void> => {

  try {

    const result = await db.select().from(product);
    res.status(200).json({ result,});

  } catch (error: any) {
    res.status(500).json({ message: error.message,});
  }
};

// ----------------------------- ✏️ UPDATE -----------------------------
export const updateProduct = async ( req: Request<{ id: string }>, res: Response): Promise<void> => {

  try {

    const id = Number(req.params.id);

    const { name, description, categories, price, } = req.body;

    const updateData: any = { name, description, categories, price,};

    // ✅ Optional image update
    if (req.file) {

      const { secure_url } = await cloud.uploader.upload(req.file.path);
      updateData.productImage = secure_url;
    }

    // ✅ Update DB
    const updatedProduct = await db
      .update(product)
      .set(updateData)
      .where(eq(product.id, id))
      .returning();

    res.status(200).json({ message: "Product updated successfully ✨", product: updatedProduct[0],});

  } catch (error: any) {
    console.log(error);
    res.status(500).json({message: error.message,});
  }
};


// ----------------------------- 🗑️ DELETE -----------------------------
export const deleteProduct = async ( req: Request<{ id: string }>, res: Response<COMMON_RESPONSE> ): Promise<void> => {

  try {

    const id = Number(req.params.id);

    // ❌ Delete Product
    await db.delete(product).where(eq(product.id, id));

    res.status(200).json({ message: "Product deleted successfully 🗑️",});

  } catch (error: any) {
    res.status(500).json({ message: error.message,});
  }
};