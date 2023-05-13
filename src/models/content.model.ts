import mongoose from "mongoose";
import mongooseDelete from "mongoose-delete";
const mSlug = require("mongoose-slug-updater");
import { helper } from "../utils";

const Content = new mongoose.Schema(
  {
    title: String,
    slug: { type: String, slug: "title" },
    subTitle: { type: String, trim: true, default: "" },
    sortDescription: { type: String, trim: true, default: "" },
    description: { type: String, trim: true, default: "" },
    appDescription: { type: String, trim: true, default: "" },
    date: { type: Date, default: helper.currentDate },
  },
  { timestamps: true }
);

Content.plugin(mongooseDelete, { overrideMethods: true });
Content.plugin(mSlug);

export default mongoose.model("contents", Content);
