import mongoose from "mongoose";
import mongooseDelete from "mongoose-delete";
import { helper } from "../utils";

const Brand = new mongoose.Schema(
  {
    image: Object,
    brandName: { type: String, default: "" },
    categories: { type: [{ type: mongoose.SchemaTypes.ObjectId, ref: "categories" }], default: [] },
    isApproved: { type: Boolean, default: false },
    date: { type: Date, default: helper.currentDate },
  },
  { timestamps: true }
);

Brand.plugin(mongooseDelete, { overrideMethods: true });

export default mongoose.model("brands", Brand);
