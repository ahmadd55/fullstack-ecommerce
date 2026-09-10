import "dotenv/config.js";
import express from "express";

import productRoutes from "./routes/product.route.js";
import categoryRoutes from "./routes/category.route.js";
import subCategoryRoutes from "./routes/subcategory.route.js";
import productImageRoutes from "./routes/productImage.route.js";
import corsMiddleware from "./middlewares/cors.middleware.js";
import addressRoutes from "./routes/address.route.js";
import wishlistRoutes from "./routes/wishlist.route.js";
import cartRoutes from "./routes/cart.route.js";
import orderRoutes from "./routes/order.route.js";
import userRoutes from "./routes/user.route.js";
import dashboardRoutes from "./routes/dashboard.route.js";
import authRoute from "./routes/auth.route.js";

const app = express();

app.use(corsMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Only meaningful in local development. In production images live on Cloudinary
// and the serverless filesystem holds nothing.
app.use("/uploads", express.static("public/uploads"));

app.get("/", (req, res) => {
  res.json({ success: true, message: "API is running" });
});

app.use("/api/auth", authRoute);
app.use("/api/categories", categoryRoutes);
app.use("/api/subcategories", subCategoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/product-images", productImageRoutes);
app.use("/api/addresses", addressRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.use((req, res) => {
  res.status(404).json({
    statusCode: 404,
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    statusCode,
    success: false,
    message: err.message || "Internal server error",
    errors: err.errors || [],
  });
});

export default app;
