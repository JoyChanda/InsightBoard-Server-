import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "./src/models/User.js";

dotenv.config();

const seedManager = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");

    const email = "tm2@gmail.com";
    const existingUser = await User.findOne({ email });

    if (existingUser) {
        // Always update password and role for test consistency
        const hashedPassword = await bcrypt.hash("Abc123456", 10);
        existingUser.password = hashedPassword;
        if (existingUser.role !== 'manager') {
            existingUser.role = 'manager';
        }
        await existingUser.save();
        console.log("Existing user updated with new password/role");
    } else {
        const hashedPassword = await bcrypt.hash("Abc123456", 10);
        await User.create({
            name: "Manager TM2",
            email,
            password: hashedPassword,
            role: "manager"
        });
        console.log("Manager user created");
    }

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedManager();
