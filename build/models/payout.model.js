"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_delete_1 = __importDefault(require("mongoose-delete"));
const utils_1 = require("../utils");
const Payouts = new mongoose_1.default.Schema({
    order: { type: mongoose_1.default.SchemaTypes.ObjectId, ref: "orders" },
    orderId: String,
    payoutAmount: Number,
    orderAmount: Number,
    vendor: { type: mongoose_1.default.SchemaTypes.ObjectId, ref: "vendors" },
    paymentMethod: String,
    date: { type: Date, default: utils_1.helper.currentDate },
    msg: { type: String, default: "" },
}, { timestamps: true });
Payouts.plugin(mongoose_delete_1.default, { overrideMethods: true });
exports.default = mongoose_1.default.model("payouts", Payouts);
