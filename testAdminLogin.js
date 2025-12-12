import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "./src/models/User.js";

dotenv.config();

const testAdminLogin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB\n");

    // Test credentials
    const testCreds = [
      { email: "super@insideboard.com", password: "superadmin123" },
      { email: "admin@insightboard.com", password: "admin123" },
    ];

    for (const cred of testCreds) {
      console.log(`\n🔍 Testing: ${cred.email}`);
      console.log("=====================================");

      const user = await User.findOne({ email: cred.email });
      
      if (!user) {
        console.log("❌ User NOT found in database");
        continue;
      }

      console.log(`✅ User found:`);
      console.log(`   Name: ${user.name}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Status: ${user.status}`);

      // Test password
      const isMatch = await bcrypt.compare(cred.password, user.password);
      
      if (isMatch) {
        console.log(`✅ Password MATCHES! Login will work.`);
      } else {
        console.log(`❌ Password DOES NOT MATCH! Login will fail.`);
        console.log(`   Expected password: ${cred.password}`);
        console.log(`   The password hash stored in DB doesn't match.`);
      }
    }

    console.log("\n=====================================\n");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

testAdminLogin();
