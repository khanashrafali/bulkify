"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_delete_1 = __importDefault(require("mongoose-delete"));
const mSlug = require("mongoose-slug-updater");
const Variant = new mongoose_1.default.Schema({
    status: { type: Boolean, default: true },
    categories: { type: [{ type: mongoose_1.default.SchemaTypes.ObjectId, ref: "categories" }], default: [] },
    brands: { type: [{ type: mongoose_1.default.SchemaTypes.ObjectId, ref: "brands" }], default: [] },
    variantName: { type: String, default: "" },
    values: { type: [String], default: [] },
    slug: { type: String, slug: "variantName" },
    variantDescription: { type: String, default: "" },
}, { timestamps: true });
Variant.plugin(mongoose_delete_1.default, { overrideMethods: true });
Variant.plugin(mSlug);
exports.default = mongoose_1.default.model("product-variant", Variant);
