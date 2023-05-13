"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_delete_1 = __importDefault(require("mongoose-delete"));
const helpers_1 = __importDefault(require("../utils/helpers"));
const mSlug = require("mongoose-slug-updater");
const Collection = new mongoose_1.default.Schema({
    chartImage: String,
    image: String,
    title: { type: String, default: "" },
    slug: { type: String, slug: "title" },
    description: { type: String, default: "" },
    status: { type: Boolean, default: true },
    mustMatchAll: { type: Boolean, default: true },
    conditions: {
        type: [{ field: String, condition: String, value: String }],
        default: [],
    },
    date: { type: Date, default: helpers_1.default.currentDate },
    createdBy: { type: mongoose_1.default.SchemaTypes.ObjectId, ref: "users" },
    isFeatured: { type: Boolean, default: false },
}, { timestamps: true });
Collection.plugin(mongoose_delete_1.default, { overrideMethods: true });
Collection.plugin(mSlug);
exports.default = mongoose_1.default.model("collections", Collection);
