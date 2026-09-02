import express from "express";
import { getProfile, updateProfile, getAdminCustomersList, updateCustomer, deleteCustomer } from "../controllers/user.controller.js";
import { authenticate, isAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();


router.get("/me", authenticate, getProfile);
router.put("/me", authenticate, updateProfile);


router.get("/customers", authenticate, isAdmin, getAdminCustomersList);
router.put("/:id", authenticate, isAdmin, updateCustomer);
router.delete("/:id", authenticate, isAdmin, deleteCustomer);

export default router;