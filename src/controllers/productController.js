import Product from "../models/Product.js";

// =========================
// GET /api/products?page=1&limit=12
// =========================
export const getProducts = async (req, res) => {
  try {
    let { page = 1, limit = 12 } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    const skip = (page - 1) * limit;

    const products = await Product.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Product.countDocuments();

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
    const products = await Product.find().sort({ createdAt: -1 }).limit(6);
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
    const { title, desc, price, qty, minQty, images, paymentOptions } = req.body;

    const newProduct = new Product({
      title,
      desc,
      price,
      qty,
      minQty,
      images,
      paymentOptions,
      createdBy: req.user.id,
    });

    const savedProduct = await newProduct.save();

    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ message: "Failed to create product", error: error.message });
  }
};
