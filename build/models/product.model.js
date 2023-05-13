"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_delete_1 = __importDefault(require("mongoose-delete"));
const utils_1 = require("../utils");
const mSlug = require("mongoose-slug-updater");
const Product = new mongoose_1.default.Schema({
    erpId: String,
    name: { type: String, default: "" },
    mainCategories: {
        type: [{ type: mongoose_1.default.SchemaTypes.ObjectId, ref: "main-categories" }],
        default: [],
    },
    slug: { type: String, slug: "name" },
    description: { type: String, default: "" },
    images: { type: [Object], default: [] },
    status: { type: Boolean, default: true },
    brand: { type: mongoose_1.default.SchemaTypes.ObjectId, ref: "brands" },
    category: { type: mongoose_1.default.SchemaTypes.ObjectId, ref: "categories" },
    subCategory: { type: mongoose_1.default.SchemaTypes.ObjectId, ref: "categories" },
    subCategories: {
        type: [{ type: mongoose_1.default.SchemaTypes.ObjectId, ref: "categories" }],
        default: [],
    },
    tags: { type: [String], default: [] },
    variants: { type: [{ variant: Object }], default: [] },
    isApproved: {
        type: String,
        enum: utils_1.CONSTANT.APPROVAL_STATUS,
        default: utils_1.CONSTANT.APPROVAL_STATUS[0],
    },
    date: { type: Date, default: utils_1.helper.currentDate },
    isFeatured: { type: Boolean, default: false },
    vendor: { type: mongoose_1.default.SchemaTypes.ObjectId, ref: "vendors" },
    metaDescription: { type: String, default: "" },
    rating: { type: Number, default: 0 },
    adminRating: { type: Number, default: 0 },
    reviewsCount: { type: Number, default: 0 },
    viewsCount: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    warranty: String,
}, { timestamps: true });
// badalDaloPrice:{type: Number, default: 0},
// SKU: { type: String },
// mrp: { type: Number, default: 0 },
// sellingPrice: { type: Number, default: 0 },
// quantity: { type: Number, default: 0 },
// deleted: { type: Boolean, default: false },
Product.plugin(mongoose_delete_1.default, { overrideMethods: true });
Product.plugin(mSlug);
Product.index({ metaDescription: "text", name: "text" });
exports.default = mongoose_1.default.model("products", Product);
