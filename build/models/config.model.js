"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_delete_1 = __importDefault(require("mongoose-delete"));
const Config = new mongoose_1.default.Schema({
    shippingCharge: { type: Number, default: 0 },
    cartTotalPrice: { type: Number, default: 0 },
}, { timestamps: true });
Config.plugin(mongoose_delete_1.default, { overrideMethods: true });
exports.default = mongoose_1.default.model("config", Config);
