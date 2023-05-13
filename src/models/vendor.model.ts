import mongoose from "mongoose";
import mongooseDelete from "mongoose-delete";
import { helper, CONSTANT } from "../utils";
import { ApprovalStatus } from "../utils/interfaces";

const Vendor = new mongoose.Schema(
  {
    avatar: { type: String, default: null },
    firstName: { type: String, default: "" },
    lastName: { type: String, default: "" },
    email: { type: String, trim: true, default: "" },
    mobileNumber: { type: String, trim: true, default: "" },
    countryCode: { type: String, trim: true, default: "" },
    category: { type: mongoose.SchemaTypes.ObjectId, ref: "categories" },
    // subCategories: { type: [{ type: mongoose.SchemaTypes.ObjectId, ref: "categories" }], default: [] },
    isActive: { type: Boolean, default: false },
    isApproved: { type: String, enum: CONSTANT.APPROVAL_STATUS, default: ApprovalStatus.PENDING },
    businessType: String,
    isProfileComplete: { type: Boolean, default: false },
    brandLogo: String,
    gstNumber: { type: String, default: "" },
    panNumber: { type: String, default: "" },
    addressProof: { type: [String], default: [] },
    address: String,
    // commissionPercent: { type: Number, default: 20 },
    password: String,
    isMobileVerified: { type: Boolean, default: false },
    isEmailVerified: { type: Boolean, default: false },
    date: { type: Date, default: helper.currentDate },
    varificationToken: String,
    expirationTime: Date,
    blockDate: Date,
    verificationType: String,
    // retryCount: 0,
    // bankDetails: {
    //   accountHolderName: { type: String, default: "" },
    //   ifscCode: { type: String, default: "" },
    //   bankName: { type: String, default: "" },
    //   accountNumber: { type: String, default: "" },
    // },
    // bio: { type: String, default: "" },
  },
  { timestamps: true }
);

Vendor.plugin(mongooseDelete, { overrideMethods: true });

export default mongoose.model("vendors", Vendor);
