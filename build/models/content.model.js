"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_delete_1 = __importDefault(require("mongoose-delete"));
const mSlug = require("mongoose-slug-updater");
const utils_1 = require("../utils");
const Content = new mongoose_1.default.Schema({
    title: String,
    slug: { type: String, slug: "title" },
    subTitle: { type: String, trim: true, default: "" },
    sortDescription: { type: String, trim: true, default: "" },
    description: { type: String, trim: true, default: "" },
    appDescription: { type: String, trim: true, default: "" },
    date: { type: Date, default: utils_1.helper.currentDate },
}, { timestamps: true });
Content.plugin(mongoose_delete_1.default, { overrideMethods: true });
Content.plugin(mSlug);
exports.default = mongoose_1.default.model("contents", Content);
