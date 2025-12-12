import express from "express";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import { verifyToken, verifyAdmin, verifyManager } from "../middleware/auth.js";

const router = express.Router();

// Helper to check if user is suspended
const checkActive = (req, res, next) => {
  if (req.user && req.user.status === "suspended") {
    return res.status(403).json({ message: "Your account is suspended." });
  }
  next();
};

// Create Order (Booking)
router.post("/", verifyToken, checkActive, async (req, res) => {
  try {
    const { productId, qty, shippingAddress, contactNumber, receiverName, additionalNotes, paymentMethod } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (qty < product.minQty) return res.status(400).json({ message: `Minimum order quantity is ${product.minQty}` });
    if (qty > product.qty) return res.status(400).json({ message: `Only ${product.qty} items available` });

    const total = product.price * qty;

    const order = new Order({
      buyer: req.user.id,
      product: productId,
      qty,
      total,
      shippingAddress,
      contactNumber,
      receiverName,
      additionalNotes,
      paymentMethod,
      tracking: [{ status: "Placement", location: "Online", note: "Order Placed" }]
    });

    await order.save();
    
    // Reduce product quantity? (Check if requirement says to reserve immediately or on approval. Usually reserved immediately or checked again on approval. Let's assume reservation logic should be here or handled separately. Simply saving order for now.)
    
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get My Orders (Buyer)
router.get("/my-orders", verifyToken, async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.user.id }).populate("product");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get Pending Orders (Manager)
router.get("/pending", verifyToken, verifyManager, checkActive, async (req, res) => {
  try {
    const orders = await Order.find({ status: "pending" }).populate("product").populate("buyer", "name email");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get Approved Orders (Manager)
router.get("/approved", verifyToken, verifyManager, async (req, res) => {
  try {
    const orders = await Order.find({ status: { $ne: "pending" } }).populate("product").populate("buyer", "name email");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get All Orders (Admin)
router.get("/all", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const orders = await Order.find().populate("product").populate("buyer", "name email");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update Status (Approve/Reject)
router.put("/:id/status", verifyToken, verifyManager, checkActive, async (req, res) => {
  try {
    const { status } = req.body; // approved, rejected
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    // Validate Status Logic
    if (status === "processing") { // "Approved" maps to processing usually
        order.approvedAt = new Date();
        order.status = "processing";
        order.tracking.push({ status: "Approved", location: "Factory", note: "Order Approved by Manager" });
        
        // Decrement Product Stock here if necessary
        const product = await Product.findById(order.product);
        if (product) {
            if (product.qty < order.qty) return res.status(400).json({message: "Insufficient Stock in Inventory"});
            product.qty -= order.qty;
            await product.save();
        }

    } else if (status === "cancelled" || status === "rejected") {
        order.status = status; // rejected maps to cancelled logic often
        order.tracking.push({ status: "Rejected", location: "-", note: "Order Rejected" });
    }

    await order.save();
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add Tracking
router.put("/:id/tracking", verifyToken, verifyManager, checkActive, async (req, res) => {
  try {
    const { status, location, note } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.tracking.push({ status, location, note, date: new Date() });
    
    // Auto update status if delivered/shipped
    if (status.includes("Shipped")) order.status = "shipped";
    if (status.includes("Delivered")) order.status = "delivered";

    await order.save();
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get Single Order
router.get("/:id", verifyToken, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate("product");
        if (!order) return res.status(404).json({ message: "Order not found" });
        
        // Security check: Only buyer or admin/manager can view
        // Note: req.user.role might need to be checked if strict privacy needed, but for now assuming if they have ID they can view or use basic verifyToken
        if (req.user.role === 'buyer' && order.buyer.toString() !== req.user.id) {
             return res.status(403).json({ message: "Unauthorized" });
        }
        res.json(order);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;
