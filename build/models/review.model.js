"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_delete_1 = __importDefault(require("mongoose-delete"));
const Review = new mongoose_1.default.Schema({
    order: { type: String },
    product: { type: String },
    commentText: { type: String },
    rating: { type: Number, default: 0 },
    vendor: { type: String },
    reviewFiles: { type: [String], default: [] },
    createdBy: { type: mongoose_1.default.SchemaTypes.ObjectId, ref: "users" },
}, { timestamps: true });
Review.plugin(mongoose_delete_1.default, { overrideMethods: true });
exports.default = mongoose_1.default.model("reviews", Review);
