"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_delete_1 = __importDefault(require("mongoose-delete"));
const utils_1 = require("../utils");
const interfaces_1 = require("../utils/interfaces");
const Admin = new mongoose_1.default.Schema({
    name: String,
    adminRole: { type: mongoose_1.default.SchemaTypes.ObjectId, ref: "roles" },
    email: { type: String, trim: true, default: "" },
    mobileNumber: { type: String, trim: true, default: "" },
    role: { type: String, enum: [interfaces_1.UserRole.ADMIN, interfaces_1.UserRole.SUPER_ADMIN] },
    address: {
        street: { type: String, default: "" },
        pinCode: { type: String, default: "" },
        city: { type: String, default: "" },
        state: { type: String, default: "" },
    },
    isApproved: { type: String, enum: utils_1.CONSTANT.APPROVAL_STATUS },
    isActive: { type: Boolean, default: false },
    isMobileVerified: { type: Boolean, default: false },
    isEmailVerified: { type: Boolean, default: false },
    date: { type: Date, default: utils_1.helper.currentDate },
    varificationToken: String,
    expirationTime: Date,
    blockDate: Date,
    verificationType: String,
    wrongAuthCount: 0,
    password: String,
}, { timestamps: true });
// Admin.index({ "address.location": "2dsphere" });
Admin.plugin(mongoose_delete_1.default, { overrideMethods: true });
exports.default = mongoose_1.default.model("admins", Admin);
