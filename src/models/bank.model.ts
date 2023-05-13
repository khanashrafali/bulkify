import mongoose from "mongoose";
import mongooseDelete from "mongoose-delete";
import { helper } from "../utils";

const Bank = new mongoose.Schema(
  {
    accountNumber: { type: String, default: "" },
    holderName: { type: String, default: "" },
    ifscCode: { type: String, default: "" },
    date: { type: Date, default: helper.currentDate },
    user: { type: mongoose.SchemaTypes.ObjectId, ref: "users" },
    isDefault: { type: Boolean, default: false },
  },
  { timestamps: true }
);

Bank.plugin(mongooseDelete, { overrideMethods: true });

export default mongoose.model("Bank", Bank);
