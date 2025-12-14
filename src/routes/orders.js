import express from "express";
import { createOrder, getMyOrders, getPendingOrders, approveOrder, rejectOrder } from "../controllers/orderController.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

// Create new order
router.post("/", auth, createOrder);

// Get logged-in user's orders
router.get("/my", auth, getMyOrders);

// Manager Routes
router.get("/pending", auth, getPendingOrders);
router.patch("/:id/approve", auth, approveOrder);
router.patch("/:id/reject", auth, rejectOrder);

export default router;
