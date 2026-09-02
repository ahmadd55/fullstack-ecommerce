import express from "express";
import { getDashboardStats } from "../controllers/dashboard.controller.js";
import { authenticate, isAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();


router.get("/stats", authenticate, isAdmin, getDashboardStats);

export default router;