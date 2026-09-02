import express from "express"

import {
  createCategoryController,
  getAllCategoriesController,
  getCategoryByIdController,
  updateCategoryController,
  deleteCategoryController,
} from "../controllers/category.controller.js";
import { authenticate,isAdmin } from "../middlewares/auth.middleware.js";

const router=express.Router();


router.post("/", authenticate, isAdmin, createCategoryController)
router.get("/", getAllCategoriesController)
router.get("/:id", getCategoryByIdController)
router.put("/:id",authenticate, isAdmin, updateCategoryController)
router.delete("/:id",authenticate,isAdmin, deleteCategoryController)


export default router;