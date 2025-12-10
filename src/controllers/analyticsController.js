import Product from "../models/Product.js";
import Order from "../models/Order.js";
import User from "../models/User.js";

// ==============================
// GET /api/analytics  (Admin only)
// ==============================
export const getAdminAnalytics = async (req, res) => {
  try {
    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);

    const [productCount, orderCount, userCount, recentOrders] =
      await Promise.all([
        Product.countDocuments({ createdAt: { $gte: last30Days } }),
        Order.countDocuments({ createdAt: { $gte: last30Days } }),
        User.countDocuments({ createdAt: { $gte: last30Days } }),
        Order.find({
          createdAt: { $gte: last30Days },
        })
          .populate("user", "name email")
          .sort({ createdAt: -1 })
          .limit(5),
      ]);

    res.json({
      success: true,
      analytics: {
        productCount,
        orderCount,
        userCount,
        recentOrders,
      },
    });
  } catch (err) {
    console.error("Analytics error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
