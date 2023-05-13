import mongoose from "mongoose";
import mongooseDelete from "mongoose-delete";
import { helper } from "../utils";
const mSlug = require("mongoose-slug-updater");

const MainCategory = new mongoose.Schema(
  {
    sno: { type: Number, default: 0 },
    name: String,
    slug: { type: String, slug: "name" },
    image: String,
    status: { type: Boolean, default: false },
    date: { type: Date, default: helper.currentDate },
  },
  { timestamps: true }
);

MainCategory.plugin(mongooseDelete, { overrideMethods: true });
MainCategory.plugin(mSlug);

export default mongoose.model("main-categories", MainCategory);
