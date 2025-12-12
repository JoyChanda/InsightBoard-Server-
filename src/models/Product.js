import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    desc: { type: String, required: true },
    category: { type: String, required: true }, // Added category
    price: { type: Number, required: true },
    qty: { type: Number, required: true },
    minQty: { type: Number, required: true, default: 1 }, // Added minQty
    images: [{ type: String }], 
    demoVideo: { type: String }, // Added demoVideo
    paymentOptions: [{ type: String }], // e.g. ["Cash on Delivery", "PayFast"]
    showOnHome: { type: Boolean, default: false }, // Added showOnHome
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
