import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './src/models/User.js';

dotenv.config();

const seedManager = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
        throw new Error("MONGO_URI not found in environment variables");
    }

    // Explicitly connect to 'insightboard' database to prevent writing to test db
    await mongoose.connect(mongoUri, { dbName: 'insightboard' });
    console.log("Connected to MongoDB: insightboard");
    
    // Check if user exists in THIS database
    const email = "testmanager@gmail.com";
    await User.deleteOne({ email });
    console.log("Cleaned up existing manager user if present.");

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("Abc123456", salt);
    
    await User.create({
        name: "Test Manager",
        email,
        password: hashedPassword,
        role: "manager",
        status: "active"
    });
    console.log("✅ Manager user seeded successfully in 'insightboard' database.");
    console.log(`Credentials: ${email} / Abc123456`);

    process.exit();
  } catch (error) {
    console.error("Error seeding manager:", error);
    process.exit(1);
  }
};

seedManager();
