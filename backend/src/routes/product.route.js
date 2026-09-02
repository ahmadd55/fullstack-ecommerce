import express from "express"
import {createProductController, getAllProductsController, getProductByIdController, updateProductController,deleteProductController, bulkUploadProducts} from "../controllers/product.controller.js"
import { authenticate,isAdmin } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/uploads.middleware.js";

const router=express.Router();

router.post("/bulk-upload", authenticate, isAdmin, upload.single("file"), bulkUploadProducts);

router.post("/", authenticate ,isAdmin, createProductController)
router.get("/", getAllProductsController);
router.get("/:id",getProductByIdController);
router.put("/:id",authenticate,isAdmin, updateProductController);
router.delete("/:id",authenticate,isAdmin, deleteProductController);


export default router;

