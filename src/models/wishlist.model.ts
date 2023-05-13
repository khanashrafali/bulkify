import mongoose from "mongoose";

const Wishlist = new mongoose.Schema(
  {
    product: { type: mongoose.SchemaTypes.ObjectId, ref: "products" },
    user: { type: mongoose.SchemaTypes.ObjectId, ref: "users" },
  },
  { timestamps: true }
);

export default mongoose.model("wishlist", Wishlist);
