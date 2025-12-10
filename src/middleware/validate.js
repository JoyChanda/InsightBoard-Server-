import { body, param, validationResult } from "express-validator";

// ======================================
// Middleware to run validation checks
// ======================================
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};

// ======================================
// Auth Validations
// ======================================
export const registerValidation = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").isEmail().normalizeEmail().withMessage("Valid email required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

export const loginValidation = [
  body("email").isEmail().normalizeEmail().withMessage("Valid email required"),
  body("password").notEmpty().withMessage("Password is required"),
];

// ======================================
// Product Validations
// ======================================
export const productValidation = [
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("description").trim().notEmpty().withMessage("Description is required"),
  body("price")
    .isNumeric()
    .withMessage("Price must be a number")
    .custom((value) => value > 0)
    .withMessage("Price must be positive"),
  body("category").trim().notEmpty().withMessage("Category is required"),
];

// ======================================
// Order Validations
// ======================================
export const orderValidation = [
  body("items")
    .isArray({ min: 1 })
    .withMessage("Order must have at least one item"),
  body("items.*.product").notEmpty().withMessage("Product ID is required"),
  body("items.*.quantity")
    .isInt({ min: 1 })
    .withMessage("Quantity must be at least 1"),
];

// ======================================
// User Role Validation
// ======================================
export const roleValidation = [
  body("role")
    .trim()
    .notEmpty()
    .withMessage("Role is required")
    .isIn(["buyer", "seller", "manager", "admin"])
    .withMessage("Invalid role"),
];

// ======================================
// Tracking Validation
// ======================================
export const trackingValidation = [
  body("status").trim().notEmpty().withMessage("Status is required"),
  body("message").optional().trim(),
];

// ======================================
// MongoDB ObjectId Validation
// ======================================
export const mongoIdValidation = [
  param("id").isMongoId().withMessage("Invalid ID format"),
];
