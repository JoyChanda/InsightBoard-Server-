import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "./src/models/User.js";

dotenv.config();

const recreateAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB\n");

    // Delete existing admin user
    const deleted = await User.deleteOne({ email: "superadmin@insightboard.com" });
    if (deleted.deletedCount > 0) {
      console.log("🗑️  Deleted existing admin user\n");
    }

    // Admin user details
    const adminData = {
      name: "Super Admin",
      email: "superadmin@insightboard.com",
      password: "admin123",
      role: "superadmin",
      status: "active",
    };

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminData.password, salt);

    // Create admin user
    const adminUser = await User.create({
      name: adminData.name,
      email: adminData.email,
      password: hashedPassword,
      role: adminData.role,
      status: adminData.status,
    });

    console.log("✅ Admin user created successfully!");
    console.log("=====================================");
    console.log("📧 Email:", adminUser.email);
    console.log("🔑 Password:", adminData.password);
    console.log("👤 Role:", adminUser.role);
    console.log("=====================================");
    console.log("\n✅ You can now login with these credentials!\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

recreateAdmin();
