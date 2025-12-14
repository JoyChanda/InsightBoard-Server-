import Order from "../models/Order.js";
import Product from "../models/Product.js";

// @desc   Create new order
// @route  POST /api/orders
// @access Private (User)
// @desc   Create new order
// @route  POST /api/orders
// @access Private (User)
export const createOrder = async (req, res) => {
  try {
    const { 
        productId, 
        qty,
        shippingAddress,
        contactNumber,
        receiverName,
        additionalNotes,
        paymentMethod
    } = req.body;

    const product = productId; // Map frontend productId to model product field

    if (!product || !qty) {
      return res.status(400).json({ message: "Product and quantity are required" });
    }

    if (qty <= 0) {
      return res.status(400).json({ message: "Quantity must be greater than zero" });
    }
    
    // Validate extra fields
    if (!shippingAddress || !contactNumber || !receiverName || !paymentMethod) {
        return res.status(400).json({ message: "All shipping and payment details are required" });
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

    // Enforce buyer role
    if (req.user.role !== "buyer") {
        return res.status(403).json({ message: "Only buyers can place orders" });
    }

    // Create order
    const order = await Order.create({
      buyer: req.user.id,
      product,
      qty,
      total,
      shippingAddress,
      contactNumber,
      receiverName,
      additionalNotes,
      paymentMethod,
      status: "pending" // Explicitly pending
    });
    
    // Decrement stock
    productDoc.qty -= qty;
    await productDoc.save();

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

// @desc   Get pending orders (Manager only)
// @route  GET /api/orders/pending
// @access Private (Manager)
export const getPendingOrders = async (req, res) => {
  try {
    // Role check
    if (req.user.role !== "manager" && req.user.role !== "superadmin") {
      return res.status(403).json({ message: "Access denied. Managers only." });
    }

    const orders = await Order.find({ status: "pending" })
      .populate("buyer", "email name")
      .populate("product", "title price images")
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Approve order (Manager only)
// @route  PATCH /api/orders/:id/approve
// @access Private (Manager)
export const approveOrder = async (req, res) => {
  try {
     if (req.user.role !== "manager" && req.user.role !== "superadmin") {
      return res.status(403).json({ message: "Access denied. Managers only." });
    }

    // Force Restart & Log
    console.log(`[ORDER] Approving order ${req.params.id}`);

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Reject order (Manager only)
// @route  PATCH /api/orders/:id/reject
// @access Private (Manager)
export const rejectOrder = async (req, res) => {
  try {
     if (req.user.role !== "manager" && req.user.role !== "superadmin") {
      return res.status(403).json({ message: "Access denied. Managers only." });
    }

    // Force Restart & Log
    console.log(`[ORDER] Rejecting order ${req.params.id}`);

    const order = await Order.findById(req.params.id);

    if (!order) {
        return res.status(404).json({ message: "Order not found" });
    }

    if (order.status === "rejected") {
        return res.status(400).json({ message: "Order is already rejected" });
    }

    // Update status
    order.status = "rejected";
    await order.save();

    // Restore Stock
    const product = await Product.findById(order.product);
    if (product) {
        product.qty += order.qty;
        await product.save();
        console.log(`[STOCK] Restored ${order.qty} items to product ${product.title}`);
    }

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
