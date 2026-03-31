import express from "express";
import {
  registerEmailPassword,
  loginEmailPassword,
  handleMicrosoftAuth,
  handleGoogleAuth,
} from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register-email", registerEmailPassword);
router.post("/google", handleGoogleAuth);
router.post("/microsoft", handleMicrosoftAuth);
router.post("/login-email", loginEmailPassword); // expects a idToken sent by the frontend

export default router;
