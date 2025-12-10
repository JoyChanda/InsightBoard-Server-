import express from "express";
import { createOrder, getMyOrders } from "../controllers/orderController.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

// Create new order
router.post("/", auth, createOrder);

// Get logged-in user's orders
router.get("/my", auth, getMyOrders);

export default router;
