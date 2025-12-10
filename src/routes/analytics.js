import express from "express";
import { getAdminAnalytics } from "../controllers/analyticsController.js";
import { auth } from "../middleware/auth.js";
import { roleCheck } from "../middleware/roleCheck.js";

const router = express.Router();

// Admin-only analytics
router.get("/", auth, roleCheck(["admin"]), getAdminAnalytics);

export default router;
