import mongoose from "mongoose";

const DeleveryAddress = new mongoose.Schema(
  {
    pincode: { type: String, default: null },
  },
  { timestamps: true }
);

export default mongoose.model("delevery-address", DeleveryAddress);
