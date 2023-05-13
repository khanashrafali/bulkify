"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_delete_1 = __importDefault(require("mongoose-delete"));
const utils_1 = require("../utils");
const Fliter = new mongoose_1.default.Schema({
    heading: { type: String, default: "Price" },
    key: { type: String, default: "PRICE" },
    date: { type: Date, default: utils_1.helper.currentDate },
    from: Number,
    diffrence: Number,
    to: Number,
}, { timestamps: true });
Fliter.plugin(mongoose_delete_1.default, { overrideMethods: true });
exports.default = mongoose_1.default.model("Fliter", Fliter);
