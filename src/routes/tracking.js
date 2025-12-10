import express from "express";
import {
  addTrackingUpdate,
  getTrackingTimeline,
} from "../controllers/trackingController.js";

import { auth } from "../middleware/auth.js";
import { roleCheck } from "../middleware/roleCheck.js";

const router = express.Router();

// Managers & Admins can update tracking
router.post(
  "/orders/:id/tracking",
  auth,
  roleCheck(["admin", "manager"]),
  addTrackingUpdate
);

// Any logged-in user can view their tracking timeline
router.get("/orders/:id/tracking", auth, getTrackingTimeline);

export default router;
