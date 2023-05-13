import mongoose from "mongoose";
import mongooseDelete from "mongoose-delete";
import { helper } from "../utils";

const User = new mongoose.Schema(
  {
    avatar: { type: String, default: null },
    name: { type: String, default: "" },
    email: { type: String, trim: true, default: "" },
    mobileNumber: { type: String, trim: true, default: "" },
    dob: { type: Date, default: null },
    isActive: { type: Boolean, default: false },
    isMobileVerified: { type: Boolean, default: false },
    isEmailVerified: { type: Boolean, default: false },
    date: { type: Date, default: helper.currentDate },
    varificationToken: String,
    expirationTime: Date,
    blockDate: Date,
    verificationType: String,
    retryCount: 0,
  },
  { timestamps: true }
);

// User.index({ "address.location": "2dsphere" });
User.plugin(mongooseDelete, { overrideMethods: true });

export default mongoose.model("users", User);
