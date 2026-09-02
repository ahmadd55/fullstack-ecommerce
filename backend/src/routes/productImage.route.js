import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { uploadProductImage } from "../middlewares/multer.middleware.js";
import {
  createProductImageController,
  getProductImagesController,
  getProductImageByIdController,
  updateProductImageController,
  deleteProductImageController,
} from "../controllers/productImage.controller.js";

const router = express.Router();


router.post("/",authenticate,uploadProductImage.single("image"),createProductImageController);
router.get("/product/:productId", getProductImagesController);
router.get("/:id",getProductImageByIdController);
router.put("/:id",authenticate,updateProductImageController);
router.delete("/:id",authenticate,deleteProductImageController);


export default router;