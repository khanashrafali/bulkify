"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Cart = new mongoose_1.default.Schema({
    product: { type: mongoose_1.default.SchemaTypes.ObjectId, ref: "products" },
    variant: Object,
    quantity: { type: Number, default: 0 },
    user: { type: mongoose_1.default.SchemaTypes.ObjectId, ref: "users" },
}, { timestamps: true });
exports.default = mongoose_1.default.model("carts", Cart);
