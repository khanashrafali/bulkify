import mongoose from "mongoose";

const Cart = new mongoose.Schema(
  {
    product: { type: mongoose.SchemaTypes.ObjectId, ref: "products" },
    variant: Object,
    quantity: { type: Number, default: 0 },
    user: { type: mongoose.SchemaTypes.ObjectId, ref: "users" },
  },
  { timestamps: true }
);

export default mongoose.model("carts", Cart);
