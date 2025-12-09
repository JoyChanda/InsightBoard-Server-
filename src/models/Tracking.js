import mongoose from "mongoose";

const trackingSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    steps: [
      {
        title: String,
        desc: String,
        date: Date,
        completed: { type: Boolean, default: false },
      },
    ],
    mapLocation: {
      lat: Number,
      lng: Number,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Tracking", trackingSchema);
