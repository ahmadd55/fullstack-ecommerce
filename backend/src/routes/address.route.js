import express from "express";
import {
  addAddress,
  getUserAddresses,
  updateAddress,
  deleteAddress,
} from "../controllers/address.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = express.Router();


router.use(authenticate);

router.post("/", addAddress);
router.get("/", getUserAddresses);
router.put("/:id", updateAddress);
router.delete("/:id", deleteAddress);

export default router;