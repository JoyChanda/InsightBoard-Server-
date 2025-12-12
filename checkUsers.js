import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./src/models/User.js";

dotenv.config();

const checkUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");

    const users = await User.find({});
    console.log(`\n📊 Total users in MongoDB: ${users.length}\n`);
    
    users.forEach(user => {
      console.log(`👤 ${user.name}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Status: ${user.status || 'active'}`);
      console.log(`   Created: ${user.createdAt}\n`);
    });

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

checkUsers();
