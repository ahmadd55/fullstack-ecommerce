import express from "express";

import {
  createSubCategoryController,
  getAllSubCategoriesController,
  getSubCategoryByIdController,
  updateSubCategoryController,
  deleteSubCategoryController,
} from "../controllers/subcategory.controller.js";
import { authenticate,isAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", authenticate, isAdmin, createSubCategoryController);
router.get("/", getAllSubCategoriesController);
router.get("/:id", getSubCategoryByIdController);
router.put("/:id",authenticate, isAdmin, updateSubCategoryController);
router.delete("/:id",authenticate, isAdmin, deleteSubCategoryController);

export default router;