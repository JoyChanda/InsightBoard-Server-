import express from "express";
import {
  getProducts,
  getHomeProducts,
  getProductById,
  createProduct,
} from "../controllers/productController.js";

import { auth } from "../middleware/auth.js";
import { roleCheck } from "../middleware/roleCheck.js";

const router = express.Router();

// GET products with pagination
router.get("/", getProducts);

// GET home latest products
router.get("/home", getHomeProducts);

// GET single product
router.get("/:id", getProductById);

// POST create product (Manager only)
router.post("/", auth, roleCheck(["manager"]), createProduct);

export default router;
