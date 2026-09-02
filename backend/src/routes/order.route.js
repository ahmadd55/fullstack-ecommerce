import express from "express";
import { placeOrder, getUserOrders, getOrderById, getAllOrdersAdmin, updateOrderStatus} from "../controllers/order.controller.js";
import { authenticate, isAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();


router.use(authenticate);

router.get("/all", isAdmin, getAllOrdersAdmin)
router.put("/:id/status", isAdmin, updateOrderStatus);

router.post("/", placeOrder);          
router.get("/", getUserOrders);       
router.get("/:id", getOrderById);      

export default router;