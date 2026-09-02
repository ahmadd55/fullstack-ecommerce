import express from "express";
import {
  addToCart,
  getCart,
  updateCartItem,
  deleteCartItem,
} from "../controllers/cart.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(authenticate);

router.post("/", addToCart);
router.get("/", getCart);
router.put("/:id", updateCartItem);
router.delete("/:id", deleteCartItem);

export default router;