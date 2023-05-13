import mongoose from "mongoose";
import mongooseDelete from "mongoose-delete";
import { helper } from "../utils";

const Fliter = new mongoose.Schema(
  {
    heading: { type: String, default: "Price" },
    key: { type: String, default: "PRICE" },
    date: { type: Date, default: helper.currentDate },
    from: Number,
    diffrence: Number,
    to: Number,
  },
  { timestamps: true }
);

Fliter.plugin(mongooseDelete, { overrideMethods: true });

export default mongoose.model("Fliter", Fliter);
