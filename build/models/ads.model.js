"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_delete_1 = __importDefault(require("mongoose-delete"));
const Ads = new mongoose_1.default.Schema({
    location: { type: String, enum: ["HOME", "FILTER"], default: "HOME" },
    redirectURL: { type: String, default: "" },
    file: { type: Object },
    product: { type: mongoose_1.default.SchemaTypes.ObjectId, ref: "products" },
}, { timestamps: true });
Ads.plugin(mongoose_delete_1.default, { overrideMethods: true });
exports.default = mongoose_1.default.model("Ads", Ads);
