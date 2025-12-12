import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./src/models/User.js";
import bcrypt from "bcryptjs";

dotenv.config();

const createBuyerUser = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");

    // Create a test buyer user
    const email = "buyer@test.com";
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      console.log("Buyer already exists");
      process.exit();
    }

    const hashedPassword = await bcrypt.hash("Buyer123", 10);
    await User.create({
      name: "Test Buyer",
      email,
      password: hashedPassword,
      role: "buyer",
      status: "active"
    });

    console.log("✅ Test buyer created:");
    console.log("   Email: buyer@test.com");
    console.log("   Password: Buyer123");
    console.log("   Role: buyer");

    // List all users
    const users = await User.find({});
    console.log(`\n📊 Total users in MongoDB: ${users.length}`);
    users.forEach(user => {
      console.log(`   - ${user.name} (${user.email}) - Role: ${user.role}`);
    });

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

createBuyerUser();
