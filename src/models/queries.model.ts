import mongoose from "mongoose";
import mongooseDelete from "mongoose-delete";
import { helper } from "../utils";

const Queries = new mongoose.Schema(
  {
    name: { type: String, default: "" },
    email: { type: String, trim: true, default: "" },
    // phone: { type: String, trim: true, default: "" },
    message: { type: String, default: "" },
    // subject: { type: String, default: "" },
  },
  { timestamps: true }
);

// Queries.index({ "address.location": "2dsphere" });
Queries.plugin(mongooseDelete, { overrideMethods: true });

export default mongoose.model("queries", Queries);
