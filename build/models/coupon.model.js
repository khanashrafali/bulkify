"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_delete_1 = __importDefault(require("mongoose-delete"));
const utils_1 = require("../utils");
const Coupon = new mongoose_1.default.Schema({
    code: String,
    discountInPercent: Number,
    startDate: Date,
    endDate: Date,
    numberOfUsers: Number,
    appliedCount: { type: Number, default: 0 },
    isPrivate: { type: Boolean, default: false },
    createBy: { type: mongoose_1.default.SchemaTypes.ObjectId, ref: "users" },
    date: { type: Date, default: utils_1.helper.currentDate },
}, { timestamps: true });
Coupon.plugin(mongoose_delete_1.default, { overrideMethods: true });
exports.default = mongoose_1.default.model("coupons", Coupon);
