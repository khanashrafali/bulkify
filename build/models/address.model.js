"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_delete_1 = __importDefault(require("mongoose-delete"));
const Address = new mongoose_1.default.Schema({
    pickup_location: { type: String, default: "" },
    name: { type: String, default: "" },
    email: { type: String, default: "" },
    phone: { type: String, default: "" },
    address: { type: String, default: "" },
    address_2: { type: String, default: "" },
    city: { type: String, default: "" },
    state: { type: String, default: "" },
    country: { type: String, default: "" },
    pin_code: { type: String, default: "" },
    user: { type: mongoose_1.default.SchemaTypes.ObjectId, ref: "users" },
    isDefault: { type: Boolean, default: false },
}, { timestamps: true });
Address.plugin(mongoose_delete_1.default, { overrideMethods: true });
exports.default = mongoose_1.default.model("address", Address);
