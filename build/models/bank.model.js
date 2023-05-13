"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_delete_1 = __importDefault(require("mongoose-delete"));
const utils_1 = require("../utils");
const Bank = new mongoose_1.default.Schema({
    accountNumber: { type: String, default: "" },
    holderName: { type: String, default: "" },
    ifscCode: { type: String, default: "" },
    date: { type: Date, default: utils_1.helper.currentDate },
    user: { type: mongoose_1.default.SchemaTypes.ObjectId, ref: "users" },
    isDefault: { type: Boolean, default: false },
}, { timestamps: true });
Bank.plugin(mongoose_delete_1.default, { overrideMethods: true });
exports.default = mongoose_1.default.model("Bank", Bank);
