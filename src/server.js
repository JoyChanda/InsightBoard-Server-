import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/products.js";
import orderRoutes from "./routes/bookings.js"; // USING bookings.js AS THE ORDER ROUTE HANDLER
import usersRoutes from "./routes/users.js";
import analyticsRoutes from "./routes/analytics.js";
import trackingRoutes from "./routes/tracking.js";

dotenv.config();

const app = express();

// ===== Middlewares =====
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ===== CORS Config =====
const allowedOrigins = [
  "http://localhost:5173",           // dev frontend (Vite)
  "http://localhost:3000",           // dev frontend (CRA)
  process.env.CLIENT_URL,            // production frontend from env
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed"));
      }
    },
    credentials: true, // allow cookies
  })
);

// ===== Routes =====
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/bookings", orderRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api", trackingRoutes);

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

// Seeding Super Admin
import User from './models/User.js';
import bcrypt from 'bcryptjs';

async function createSuperAdmin() {
  try {
    const exists = await User.findOne({ role: 'superadmin' });
    if (exists) return;

    const hashed = await bcrypt.hash("superadmin123", 10);

    await User.create({
      name: "Super Admin",
      email: "super@insideboard.com",
      password: hashed,
      role: "superadmin"
    });

    console.log("🌟 Super Admin created!");
  } catch (err) {
    console.error("Super Admin Seed Error:", err);
  }
}

connectDB().then(async () => {
  await createSuperAdmin();
  app.listen(PORT, () =>
    console.log(`🚀 Server running on http://localhost:${PORT}`)
  );
});
