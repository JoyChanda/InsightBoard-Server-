import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    qty: { type: Number, required: true },
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "processing", "shipped", "delivered", "cancelled", "rejected"],
      default: "pending",
    },
    shippingAddress: { type: String, required: true },
    contactNumber: { type: String, required: true },
    receiverName: { type: String, required: true },
    additionalNotes: { type: String },
    paymentMethod: { type: String, required: true },
    tracking: [
      {
        status: String, // e.g., "Cutting Completed"
        location: String,
        note: String,
        date: { type: Date, default: Date.now },
      },
    ],
    approvedAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
