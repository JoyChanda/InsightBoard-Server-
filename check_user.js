import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';

dotenv.config();

const checkUser = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected to:', process.env.MONGO_URI.split('@')[1]); // Mask credential

    const email = "testmanager@gmail.com";
    const user = await User.findOne({ email });

    if (user) {
        console.log("✅ User Found:", user.name);
        console.log("Role:", user.role);
        console.log("Password Hash starts with:", user.password.substring(0, 10));
    } else {
        console.log("❌ User NOT Found");
    }

    process.exit();
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
};

checkUser();
