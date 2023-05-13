import mongoose from "mongoose";
import mongooseDelete from "mongoose-delete";
import { helper } from "../utils";

const Coupon = new mongoose.Schema(
  {
    code: String,
    discountInPercent: Number,
    startDate: Date,
    endDate: Date,
    numberOfUsers: Number,
    appliedCount: { type: Number, default: 0 },
    isPrivate: { type: Boolean, default: false },
    createBy: { type: mongoose.SchemaTypes.ObjectId, ref: "users" },
    date: { type: Date, default: helper.currentDate },
  },
  { timestamps: true }
);

Coupon.plugin(mongooseDelete, { overrideMethods: true });

export default mongoose.model("coupons", Coupon);
