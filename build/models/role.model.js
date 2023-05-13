"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_delete_1 = __importDefault(require("mongoose-delete"));
const Role = new mongoose_1.default.Schema({
    roleName: String,
    permissions: {
        type: [
            {
                module: String,
                read: Boolean,
                write: Boolean,
                delete: Boolean,
            },
        ],
        default: [],
    },
}, { timestamps: true });
Role.plugin(mongoose_delete_1.default, { overrideMethods: true });
exports.default = mongoose_1.default.model("roles", Role);
