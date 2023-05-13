import mongoose from "mongoose";
import mongooseDelete from "mongoose-delete";

const Review = new mongoose.Schema(
  {
    order: { type: String },
    product: { type: String },
    commentText: { type: String },
    rating: { type: Number, default: 0 },
    vendor: { type: String },
    reviewFiles: { type: [String], default: [] },
    createdBy: { type: mongoose.SchemaTypes.ObjectId, ref: "users" },
  },
  { timestamps: true }
);

Review.plugin(mongooseDelete, { overrideMethods: true });
export default mongoose.model("reviews", Review);
