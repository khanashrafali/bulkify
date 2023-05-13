"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_delete_1 = __importDefault(require("mongoose-delete"));
const utils_1 = require("../utils");
const mSlug = require("mongoose-slug-updater");
const MainCategory = new mongoose_1.default.Schema({
    sno: { type: Number, default: 0 },
    name: String,
    slug: { type: String, slug: "name" },
    image: String,
    status: { type: Boolean, default: false },
    date: { type: Date, default: utils_1.helper.currentDate },
}, { timestamps: true });
MainCategory.plugin(mongoose_delete_1.default, { overrideMethods: true });
MainCategory.plugin(mSlug);
exports.default = mongoose_1.default.model("main-categories", MainCategory);
