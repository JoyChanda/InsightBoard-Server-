import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/products.js";
import orderRoutes from "./routes/orders.js";

dotenv.config();

const app = express();

// ===== Middlewares =====
app.use(express.json());
app.use(cors({
  origin: ["http://localhost:5173"],
  credentials: true,
}));
app.use(cookieParser());

// ===== Routes =====
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

// ===== Test Route =====
app.get("/", (req, res) => {
  res.send("API is running...");
});

// ===== 404 Handler =====
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

// ===== Error Handler =====
app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// ===== Start Server =====
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () =>
    console.log(`🚀 Server running on http://localhost:${PORT}`)
  );
});
