"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_delete_1 = __importDefault(require("mongoose-delete"));
const utils_1 = require("../utils");
const Brand = new mongoose_1.default.Schema({
    image: Object,
    brandName: { type: String, default: "" },
    categories: { type: [{ type: mongoose_1.default.SchemaTypes.ObjectId, ref: "categories" }], default: [] },
    isApproved: { type: Boolean, default: false },
    date: { type: Date, default: utils_1.helper.currentDate },
}, { timestamps: true });
Brand.plugin(mongoose_delete_1.default, { overrideMethods: true });
exports.default = mongoose_1.default.model("brands", Brand);
