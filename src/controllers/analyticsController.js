import Product from "../models/Product.js";
import Order from "../models/Order.js";
import User from "../models/User.js";

// ==============================
// GET /api/analytics  (Admin only)
// ==============================
export const getAdminAnalytics = async (req, res) => {
  try {
    const { timeRange = 'all' } = req.query;
    
    // Calculate Start Date
    let startDate = new Date(0); // Default to beginning of time
    const now = new Date();

    if (timeRange === 'today') {
      startDate = new Date(now.setHours(0, 0, 0, 0));
    } else if (timeRange === 'week') {
      startDate = new Date(now.setDate(now.getDate() - 7));
    } else if (timeRange === 'month') {
      startDate = new Date(now.setDate(now.getDate() - 30));
    }

    // Filter Query
    const dateFilter = { createdAt: { $gte: startDate } };

    // Parallel Execution
    const [
      totalUsers,
      totalProducts,
      totalOrders,
      totalIncomeResult,
      activeManagers,
      ordersByStatus,
      productsByCategory,
      ordersTrend
    ] = await Promise.all([
      User.countDocuments(dateFilter),
      Product.countDocuments(dateFilter),
      Order.countDocuments(dateFilter),
      Order.aggregate([
        { $match: dateFilter },
        { $group: { _id: null, total: { $sum: "$total" } } }
      ]),
      User.countDocuments({ role: 'manager', status: 'active' }), // distinct stat, no date filter
      Order.aggregate([
        { $match: dateFilter },
        { $group: { _id: "$status", count: { $sum: 1 } } }
      ]),
      Product.aggregate([
        // Categories usually reflect whole inventory, but we can filter if asked. 
        // User asked for "Weekly/Monthly products", so let's stick to dateFilter for consistency with dashboard toggles.
        // Actually for Pie Chart, seeing ONLY new products' categories might be misleading.
        // Let's keep Category distribution for ALL products to show "Portfolio", 
        // while the "Total Products" card shows the "New" count.
        // Re-reading: User wants "Weekly / Monthly products".
        // Let's use dateFilter for consistency.
        { $match: dateFilter },
        { $group: { _id: "$category", count: { $sum: 1 } } }
      ]),
      Order.aggregate([
        { $match: dateFilter },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            orders: { $sum: 1 },
            sales: { $sum: "$total" }
          }
        },
        { $sort: { _id: 1 } }
      ])
    ]);

    const totalIncome = totalIncomeResult[0]?.total || 0;

    res.json({
      success: true,
      analytics: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalIncome,
        activeManagers,
        ordersByStatus,
        productsByCategory,
        ordersTrend,
        timeRange
      },
    });
  } catch (err) {
    console.error("Analytics error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
