import express from "express";
import cors from "cors";
import authRoute from "./routes/auth.route";
import productRoute from "./routes/product.route";
import cartRoute from "./routes/cart.route";
import { FRONTEND_URL, NODE_ENV, PRODUCTION } from "./config/env";
import cookieParser from "cookie-parser";

const app = express();

app.use(cookieParser()); 

// Middlewares
app.use(cors({ origin: FRONTEND_URL, credentials: true }));

app.use(express.json());

// -----------------------------
// Routes
// -----------------------------
app.use("/api/auth", authRoute);
app.use("/api/product", productRoute);
app.use("/api/cart", cartRoute);


// Test route
app.get("/", (req, res) => {
  res.json({ message: "Ecom Turbo API is up and shining 🌸 🚀" });
});

const PORT = 5500;

// 🚀 Launching the server like a queen
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`); // 💻 My backend is officially slaying
// });

// SERVER 🌎

if(NODE_ENV !== PRODUCTION){
    app.listen(PORT, () => {
    console.log(` 🚀 Server running on port ${PORT}`)
})
}

export default app