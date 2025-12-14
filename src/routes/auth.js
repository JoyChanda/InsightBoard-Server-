import express from "express";
import { register, login, logout, verify, socialLogin, getMe } from "../controllers/authController.js";
import { auth as protect } from "../middleware/auth.js";
import {
  validate,
  registerValidation,
  loginValidation,
} from "../middleware/validate.js";

const router = express.Router();

router.post("/register", registerValidation, validate, register);
router.post("/login", loginValidation, validate, login);
router.post("/social-login", socialLogin);
router.post("/logout", logout);
router.get("/verify", verify);
router.get("/me", protect, getMe);

export default router;
