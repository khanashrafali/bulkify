import mongoose from "mongoose";
import mongooseDelete from "mongoose-delete";
import { CONSTANT, helper } from "../utils";
import { UserRole } from "../utils/interfaces";

const Admin = new mongoose.Schema(
  {
    name: String,
    adminRole: { type: mongoose.SchemaTypes.ObjectId, ref: "roles" },
    email: { type: String, trim: true, default: "" },
    mobileNumber: { type: String, trim: true, default: "" },
    role: { type: String, enum: [UserRole.ADMIN, UserRole.SUPER_ADMIN] },
    address: {
      street: { type: String, default: "" },
      pinCode: { type: String, default: "" },
      city: { type: String, default: "" },
      state: { type: String, default: "" },
    },
    isApproved: { type: String, enum: CONSTANT.APPROVAL_STATUS },
    isActive: { type: Boolean, default: false },
    isMobileVerified: { type: Boolean, default: false },
    isEmailVerified: { type: Boolean, default: false },
    date: { type: Date, default: helper.currentDate },
    varificationToken: String,
    expirationTime: Date,
    blockDate: Date,
    verificationType: String,
    wrongAuthCount: 0,
    password: String,
  },
  { timestamps: true }
);

// Admin.index({ "address.location": "2dsphere" });
Admin.plugin(mongooseDelete, { overrideMethods: true });

export default mongoose.model("admins", Admin);
