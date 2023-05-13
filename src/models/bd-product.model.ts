import mongoose from "mongoose";

const BDProduct = new mongoose.Schema(
  {
    product: { type: mongoose.SchemaTypes.ObjectId, ref: "products" },
    variant: String,
    comment: String,
    file: String,
    user: { type: mongoose.SchemaTypes.ObjectId, ref: "users" },
  },
  { timestamps: true }
);

export default mongoose.model("BDProduct", BDProduct);
