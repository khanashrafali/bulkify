import mongoose from "mongoose";
import mongooseDelete from "mongoose-delete";
import { helper } from "../utils";

const Payouts = new mongoose.Schema(
  {
    order: { type: mongoose.SchemaTypes.ObjectId, ref: "orders" },
    orderId: String,
    payoutAmount: Number,
    orderAmount: Number,
    vendor: { type: mongoose.SchemaTypes.ObjectId, ref: "vendors" },
    paymentMethod: String,
    date: { type: Date, default: helper.currentDate },
    msg: { type: String, default: "" },
  },
  { timestamps: true }
);

Payouts.plugin(mongooseDelete, { overrideMethods: true });
export default mongoose.model("payouts", Payouts);
