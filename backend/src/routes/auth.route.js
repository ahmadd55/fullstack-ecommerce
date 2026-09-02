import express from "express";
const router = express.Router();

import { register, addProfilePicture } from "../controllers/auth.controller.js";
import { login } from "../controllers/auth.controller.js";
import { logout } from "../controllers/auth.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/uploads.middleware.js";

router.post("/register", register);
router.post("/login", login);
router.post("/logout", authenticate, logout);
router.post("/add-profile-picture/:id", upload.single("profilePicture"), addProfilePicture);

export default router;