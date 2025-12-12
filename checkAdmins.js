import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./src/models/User.js";

dotenv.config();

const checkAdminUsers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB\n");

    // Find all admin users
    const adminUsers = await User.find({ 
      role: { $in: ["admin", "superadmin"] } 
    });

    console.log(`Found ${adminUsers.length} admin/superadmin user(s):\n`);
    console.log("=====================================");
    
    adminUsers.forEach((user, index) => {
      console.log(`\n${index + 1}. Admin User:`);
      console.log(`   📧 Email: ${user.email}`);
      console.log(`   👤 Name: ${user.name}`);
      console.log(`   🎭 Role: ${user.role}`);
      console.log(`   📊 Status: ${user.status}`);
      console.log(`   🔑 Password Hash: ${user.password.substring(0, 20)}...`);
    });

    console.log("\n=====================================");
    console.log("\n💡 Try logging in with these credentials:");
    adminUsers.forEach((user) => {
      console.log(`\n📧 Email: ${user.email}`);
      console.log(`🔑 Password: Check createAdmin.js or server.js for the original password`);
    });

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

checkAdminUsers();
