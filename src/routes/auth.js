import express from "express";
import { register, login, logout, verify } from "../controllers/authController.js";
import {
  validate,
  registerValidation,
  loginValidation,
} from "../middleware/validate.js";

const router = express.Router();

router.post("/register", registerValidation, validate, register);
router.post("/login", loginValidation, validate, login);
router.post("/logout", logout);
router.get("/verify", verify);

export default router;
