import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./src/models/User.js";

dotenv.config();

const deleteRegularAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB\n");

    // Delete regular admin user
    const result = await User.deleteOne({ 
      email: "admin@insightboard.com",
      role: "admin" 
    });

    if (result.deletedCount > 0) {
      console.log("✅ Regular admin user deleted successfully!");
      console.log("📧 Email: admin@insightboard.com");
      console.log("\n🌟 Only SUPERADMIN can now access admin features\n");
    } else {
      console.log("ℹ️  No regular admin user found to delete");
    }

    // Show remaining admin users
    const admins = await User.find({ role: "superadmin" });
    console.log("=====================================");
    console.log(`Remaining Superadmin users: ${admins.length}`);
    admins.forEach(admin => {
      console.log(`\n📧 Email: ${admin.email}`);
      console.log(`👤 Name: ${admin.name}`);
    });
    console.log("\n=====================================\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

deleteRegularAdmin();
