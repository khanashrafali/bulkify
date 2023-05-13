import mongoose from "mongoose";
import mongooseDelete from "mongoose-delete";

const Config = new mongoose.Schema(
  {
    shippingCharge: { type: Number, default: 0 },
    cartTotalPrice: { type: Number, default: 0 },
  },
  { timestamps: true }
);

Config.plugin(mongooseDelete, { overrideMethods: true });

export default mongoose.model("config", Config);
