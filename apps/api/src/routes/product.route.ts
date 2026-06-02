import { Router } from "express";
import { createProduct, deleteProduct, getProduct, updateProduct } from "../controllers/product.controller";
import { productUpload } from "../utils/upload";



const router = Router();


router
    .post("/create-product",productUpload, createProduct )
    .get("/get-products", getProduct )
    .put("/update-product/:id", productUpload, updateProduct)
    .delete("/delete-product/:id", deleteProduct)


export default router;