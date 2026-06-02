import multer, { diskStorage } from "multer";

// export const productImageUpload = multer({ storage: diskStorage({}) }).fields([
//   { name: "productImage", maxCount: 1 },
// ]);

// 🚀 Product Upload Middleware
export const productUpload = multer({
  storage: diskStorage({})
}).single("productImage");