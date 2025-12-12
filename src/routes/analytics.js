import express from "express";
import { getAdminAnalytics } from "../controllers/analyticsController.js";
import { verifyToken, verifyAdmin } from "../middleware/auth.js";

const router = express.Router();

router.get("/dashboard", verifyToken, verifyAdmin, getAdminAnalytics);

export default router;
