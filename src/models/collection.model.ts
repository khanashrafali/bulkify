import mongoose from "mongoose";
import mongooseDelete from "mongoose-delete";
import helper from "../utils/helpers";
const mSlug = require("mongoose-slug-updater");

const Collection = new mongoose.Schema(
  {
    chartImage: String,
    image: String,
    title: { type: String, default: "" },
    slug: { type: String, slug: "title" },
    description: { type: String, default: "" },
    status: { type: Boolean, default: true },
    mustMatchAll: { type: Boolean, default: true },
    conditions: {
      type: [{ field: String, condition: String, value: String }],
      default: [],
    },
    date: { type: Date, default: helper.currentDate },
    createdBy: { type: mongoose.SchemaTypes.ObjectId, ref: "users" },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

Collection.plugin(mongooseDelete, { overrideMethods: true });
Collection.plugin(mSlug);

export default mongoose.model("collections", Collection);
