import Tracking from "../models/Tracking.js";
import Order from "../models/Order.js";

// ======================================
// POST /api/orders/:id/tracking
// Add tracking timeline event
// ======================================
export const addTrackingUpdate = async (req, res) => {
  try {
    const { status, message } = req.body;
    const orderId = req.params.id;

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    // Ensure order exists
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Create tracking entry
    const update = await Tracking.create({
      order: orderId,
      status,
      message: message || "",
      updatedBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Tracking update added",
      update,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to add tracking update" });
  }
};

// ======================================
// GET /api/orders/:id/tracking
// Get timeline for a single order
// ======================================
export const getTrackingTimeline = async (req, res) => {
  try {
    const orderId = req.params.id;

    const timeline = await Tracking.find({ order: orderId })
      .populate("updatedBy", "name email role")
      .sort({ createdAt: 1 });

    res.json({
      success: true,
      timeline,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch tracking timeline" });
  }
};
