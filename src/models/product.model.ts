import mongoose from "mongoose";
import mongooseDelete from "mongoose-delete";
import { CONSTANT, helper } from "../utils";
const mSlug = require("mongoose-slug-updater");

const Product = new mongoose.Schema(
  {
    erpId: String,
    name: { type: String, default: "" },
    mainCategories: {
      type: [{ type: mongoose.SchemaTypes.ObjectId, ref: "main-categories" }],
      default: [],
    },
    slug: { type: String, slug: "name" },
    description: { type: String, default: "" },
    images: { type: [Object], default: [] },
    status: { type: Boolean, default: true },
    brand: { type: mongoose.SchemaTypes.ObjectId, ref: "brands" },
    category: { type: mongoose.SchemaTypes.ObjectId, ref: "categories" },
    subCategory: { type: mongoose.SchemaTypes.ObjectId, ref: "categories" },
    subCategories: {
      type: [{ type: mongoose.SchemaTypes.ObjectId, ref: "categories" }],
      default: [],
    },
    tags: { type: [String], default: [] },
    variants: { type: [{ variant: Object }], default: [] },
    isApproved: {
      type: String,
      enum: CONSTANT.APPROVAL_STATUS,
      default: CONSTANT.APPROVAL_STATUS[0],
    },
    date: { type: Date, default: helper.currentDate },
    isFeatured: { type: Boolean, default: false },
    vendor: { type: mongoose.SchemaTypes.ObjectId, ref: "vendors" },
    metaDescription: { type: String, default: "" },
    rating: { type: Number, default: 0 },
    adminRating: { type: Number, default: 0 },
    reviewsCount: { type: Number, default: 0 },
    viewsCount: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    warranty: String,
  },
  { timestamps: true }
);

// badalDaloPrice:{type: Number, default: 0},
// SKU: { type: String },
// mrp: { type: Number, default: 0 },
// sellingPrice: { type: Number, default: 0 },
// quantity: { type: Number, default: 0 },
// deleted: { type: Boolean, default: false },

Product.plugin(mongooseDelete, { overrideMethods: true });
Product.plugin(mSlug);
Product.index({ metaDescription: "text", name: "text" });

export default mongoose.model("products", Product);
