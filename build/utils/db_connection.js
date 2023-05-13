"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const helpers_1 = __importDefault(require("./helpers"));
helpers_1.default.loadEnvFile();
// create connection to mongodb
exports.default = mongoose_1.default.connect(process.env.DB_URI, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true });
