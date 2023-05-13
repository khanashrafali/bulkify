"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_delete_1 = __importDefault(require("mongoose-delete"));
const Queries = new mongoose_1.default.Schema({
    name: { type: String, default: "" },
    email: { type: String, trim: true, default: "" },
    // phone: { type: String, trim: true, default: "" },
    message: { type: String, default: "" },
    // subject: { type: String, default: "" },
}, { timestamps: true });
// Queries.index({ "address.location": "2dsphere" });
Queries.plugin(mongoose_delete_1.default, { overrideMethods: true });
exports.default = mongoose_1.default.model("queries", Queries);
