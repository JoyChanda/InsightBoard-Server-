import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './src/models/User.js';

dotenv.config();

const seedManager = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    await User.deleteOne({ email: "testmanager@gmail.com" });
    console.log("Deleted existing user.");

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("Abc123456", salt);
    
    await User.create({
        name: "Test Manager",
        email: "testmanager@gmail.com",
        password: hashedPassword,
        role: "manager",
        status: "active"
    });
    console.log("✅ Manager user recreated.");

    process.exit();
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
};

seedManager();
