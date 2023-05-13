import mongoose from "mongoose";
import mongooseDelete from "mongoose-delete";
import { helper } from "../utils";

const Address = new mongoose.Schema(
  {
    pickup_location: { type: String, default: "" },
    name: { type: String, default: "" },
    email: { type: String, default: "" },
    phone: { type: String, default: "" },
    address: { type: String, default: "" },
    address_2: { type: String, default: "" },
    city: { type: String, default: "" },
    state: { type: String, default: "" },
    country: { type: String, default: "" },
    pin_code: { type: String, default: "" },
    user: { type: mongoose.SchemaTypes.ObjectId, ref: "users" },
    isDefault: { type: Boolean, default: false },
  },
  { timestamps: true }
);

Address.plugin(mongooseDelete, { overrideMethods: true });

export default mongoose.model("address", Address);
