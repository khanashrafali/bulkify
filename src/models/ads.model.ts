import mongoose from "mongoose";
import mongooseDelete from "mongoose-delete";
import { helper } from "../utils";

const Ads = new mongoose.Schema(
  {
    location: { type: String, enum: ["HOME", "FILTER"], default: "HOME" },
    redirectURL: { type: String, default: "" },
    file: { type: Object },
    product: { type: mongoose.SchemaTypes.ObjectId, ref: "products" },
  },
  { timestamps: true }
);

Ads.plugin(mongooseDelete, { overrideMethods: true });

export default mongoose.model("Ads", Ads);
