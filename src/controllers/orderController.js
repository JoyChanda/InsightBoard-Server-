import Order from "../models/Order.js";
import Product from "../models/Product.js";

// @desc   Create new order
// @route  POST /api/orders
// @access Private (User)
export const createOrder = async (req, res) => {
  try {
    const { product, qty } = req.body;

    if (!product || !qty) {
      return res
        .status(400)
        .json({ message: "Product and quantity are required" });
    }

    if (qty <= 0) {
      return res
        .status(400)
        .json({ message: "Quantity must be greater than zero" });
    }

    // Check if product exists
    const productDoc = await Product.findById(product);
    if (!productDoc) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if sufficient quantity available
    if (productDoc.qty < qty) {
      return res
        .status(400)
        .json({ message: `Only ${productDoc.qty} items available in stock` });
    }

    // Calculate total
    const total = productDoc.price * qty;

    // Create order
    const order = await Order.create({
      buyer: req.user.id,
      product,
      qty,
      total,
    });

    // Populate product details for response
    await order.populate("product", "title price images");

    res.status(201).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get logged-in user's orders
// @route  GET /api/orders/my
// @access Private
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.user.id })
      .populate("product", "title price images")
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
