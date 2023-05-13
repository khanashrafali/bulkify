import mongoose from "mongoose";
import mongooseDelete from "mongoose-delete";
import { helper } from "../utils";

const Notification = new mongoose.Schema(
  {
    msg: { type: String, default: "" },
    readingByUsers: { type: [{ type: mongoose.SchemaTypes.ObjectId, ref: "users" }], default: [] },
  },
  { timestamps: true }
);

Notification.plugin(mongooseDelete, { overrideMethods: true });

export default mongoose.model("notifications", Notification);
