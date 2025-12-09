import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    desc: { type: String, required: true },
    price: { type: Number, required: true },
    qty: { type: Number, required: true },
    minQty: { type: Number, required: true },
    images: [{ type: String }], 
    paymentOptions: [{ type: String }], // e.g. [bkash", "cod"]
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
