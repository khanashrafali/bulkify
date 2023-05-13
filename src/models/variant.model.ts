import mongoose from "mongoose";
import mongooseDelete from "mongoose-delete";
const mSlug = require("mongoose-slug-updater");

const Variant = new mongoose.Schema(
  {
    status: { type: Boolean, default: true },
    categories: { type: [{ type: mongoose.SchemaTypes.ObjectId, ref: "categories" }], default: [] },
    brands: { type: [{ type: mongoose.SchemaTypes.ObjectId, ref: "brands" }], default: [] },
    variantName: { type: String, default: "" },
    values: { type: [String], default: [] },
    slug: { type: String, slug: "variantName" },
    variantDescription: { type: String, default: "" },
  },
  { timestamps: true }
);

Variant.plugin(mongooseDelete, { overrideMethods: true });
Variant.plugin(mSlug);

export default mongoose.model("product-variant", Variant);
