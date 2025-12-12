import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["buyer", "manager", "admin", "superadmin"],
      default: "buyer",
    },
    status: {
      type: String,
      enum: ["active", "suspended"],
      default: "active",
    },
    suspendReason: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);

