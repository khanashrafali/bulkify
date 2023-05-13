import mongoose from "mongoose";
import mongooseDelete from "mongoose-delete";
import { helper } from "../utils";
const mSlug = require("mongoose-slug-updater");

const Category = new mongoose.Schema(
  {
    sno: { type: Number, default: 0 },
    name: String,
    slug: { type: String, slug: "name" },
    level: Number,
    image: Object,
    subCategories: { type: [{ type: mongoose.SchemaTypes.ObjectId, ref: "categories" }], default: [] },
    collections: { type: [{ type: mongoose.SchemaTypes.ObjectId, ref: "collections" }], default: [] },
    createdBy: { type: mongoose.SchemaTypes.ObjectId, ref: "users" },
    status: { type: Boolean, default: false },
    date: { type: Date, default: helper.currentDate },
  },
  { timestamps: true }
);

Category.plugin(mongooseDelete, { overrideMethods: true });
Category.plugin(mSlug);

export default mongoose.model("categories", Category);
