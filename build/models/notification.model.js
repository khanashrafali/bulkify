"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_delete_1 = __importDefault(require("mongoose-delete"));
const Notification = new mongoose_1.default.Schema({
    msg: { type: String, default: "" },
    readingByUsers: { type: [{ type: mongoose_1.default.SchemaTypes.ObjectId, ref: "users" }], default: [] },
}, { timestamps: true });
Notification.plugin(mongoose_delete_1.default, { overrideMethods: true });
exports.default = mongoose_1.default.model("notifications", Notification);
