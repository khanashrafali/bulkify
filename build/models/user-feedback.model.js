"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_delete_1 = __importDefault(require("mongoose-delete"));
const mSlug = require("mongoose-slug-updater");
const UserFeedback = new mongoose_1.default.Schema({
    name: String,
    email: String,
    phone: String,
}, { timestamps: true });
UserFeedback.plugin(mongoose_delete_1.default, { overrideMethods: true });
UserFeedback.plugin(mSlug);
exports.default = mongoose_1.default.model("user-feedback", UserFeedback);
