import Product from "../models/Product.js";

// =========================
// GET /api/products?page=1&limit=12&search=camera&category=electronics
// =========================
export const getProducts = async (req, res) => {
  try {
    let { page = 1, limit = 12, search = "", category = "" } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    const query = {};
    if (search) {
      query.title = { $regex: search, $options: "i" }; // Case insensitive search
    }
    if (category) {
      query.category = category;
    }

    const skip = (page - 1) * limit;

    const products = await Product.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Product.countDocuments(query);

    res.json({
      products,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products." });
  }
};

// =========================
// GET /api/products/home  (show latest 6)
// =========================
export const getHomeProducts = async (req, res) => {
  try {
    const products = await Product.find({ showOnHome: true }).sort({ createdAt: -1 }).limit(6);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Failed to load home products." });
  }
};

// =========================
// GET /api/products/:id
// =========================
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product)
      return res.status(404).json({ message: "Product not found" });

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Failed to load product" });
  }
};

// =========================
// POST /api/products (Manager Only)
// =========================
export const createProduct = async (req, res) => {
  try {
    // Check if user is suspended
    if (req.user.status === "suspended") {
        return res.status(403).json({ message: "You are suspended. Cannot create products." });
    }

    const { title, desc, category, price, qty, minQty, images, demoVideo, paymentOptions, showOnHome } = req.body;

    const newProduct = new Product({
      title,
      desc,
      category,
      price,
      qty,
      minQty,
      images,
      demoVideo,
      paymentOptions,
      showOnHome,
      createdBy: req.user.id,
    });

    const savedProduct = await newProduct.save();

    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ message: "Failed to create product", error: error.message });
  }
};

// =========================
// PATCH /api/products/:id (Admin/Manager)
// =========================
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Update the product
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update product", error: error.message });
  }
};

// =========================
// DELETE /api/products/:id (Admin/Manager)
// =========================
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await Product.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Product deleted successfully"
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete product", error: error.message });
  }
};

