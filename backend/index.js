import "dotenv/config.js";
import express from "express";
import { sequelize } from "./src/models/index.js";
import productRoutes from "./src/routes/product.route.js";
import categoryRoutes from "./src/routes/category.route.js";
import subCategoryRoutes from "./src/routes/subcategory.route.js";
import productImageRoutes from "./src/routes/productImage.route.js";
import corsMiddleware from "./src/middlewares/cors.middleware.js";
import addressRoutes from "./src/routes/address.route.js";
import wishlistRoutes from "./src/routes/wishlist.route.js";
import cartRoutes from "./src/routes/cart.route.js";
import orderRoutes from "./src/routes/order.route.js";
import userRoutes from "./src/routes/user.route.js";
import dashboardRoutes from "./src/routes/dashboard.route.js";


import authRoute from "./src/routes/auth.route.js";

const app = express();
const PORT = process.env.PORT

app.get("/", (req, res) => {
  res.send("Hello guyss");
});

app.use(corsMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("public/uploads"));

app.use("/api/auth", authRoute);

app.use("/api/categories", categoryRoutes);
app.use("/api/subcategories", subCategoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/product-images",productImageRoutes);
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


try {
  await sequelize.authenticate();
  console.log("PostgreSQL connected successfully");


  await sequelize.sync({ alter: true }); 
  console.log("Tables synchronized successfully");

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
} catch (error) {
  console.error(" Database error:");
  console.error(error.message);
}