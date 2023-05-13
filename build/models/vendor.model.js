"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_delete_1 = __importDefault(require("mongoose-delete"));
const utils_1 = require("../utils");
const interfaces_1 = require("../utils/interfaces");
const Vendor = new mongoose_1.default.Schema({
    avatar: { type: String, default: null },
    images: { type: [String], default: [] },
    video: { type: String, default: null },
    name: { type: String, default: "" },
    email: { type: String, trim: true, default: "" },
    mobileNumber: { type: String, trim: true, default: "" },
    category: { type: mongoose_1.default.SchemaTypes.ObjectId, ref: "categories" },
    subCategories: { type: [{ type: mongoose_1.default.SchemaTypes.ObjectId, ref: "categories" }], default: [] },
    isActive: { type: Boolean, default: false },
    isApproved: { type: String, enum: utils_1.CONSTANT.APPROVAL_STATUS, default: interfaces_1.ApprovalStatus.PENDING },
    businessType: String,
    isProfileComplete: { type: Boolean, default: false },
    brandLogo: String,
    gstNumber: { type: String, default: "" },
    panNumber: { type: String, default: "" },
    addressProof: { type: [String], default: [] },
    address: String,
    commissionPercent: { type: Number, default: 20 },
    password: String,
    isMobileVerified: { type: Boolean, default: false },
    isEmailVerified: { type: Boolean, default: false },
    date: { type: Date, default: utils_1.helper.currentDate },
    varificationToken: String,
    expirationTime: Date,
    blockDate: Date,
    verificationType: String,
    retryCount: 0,
    bankDetails: {
        accountHolderName: { type: String, default: "" },
        ifscCode: { type: String, default: "" },
        bankName: { type: String, default: "" },
        accountNumber: { type: String, default: "" },
    },
    bio: { type: String, default: "" },
}, { timestamps: true });
Vendor.plugin(mongoose_delete_1.default, { overrideMethods: true });
exports.default = mongoose_1.default.model("vendors", Vendor);
