"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mSlug = require("mongoose-slug-updater");
const Slider = new mongoose_1.default.Schema({
    longSlider: {
        slides: {
            type: [
                {
                    isImg: { type: Boolean, default: true },
                    image: { type: Object },
                    redirectUrl: { type: String, default: "" },
                    product: { type: mongoose_1.default.SchemaTypes.ObjectId, ref: "products" },
                },
            ],
            default: [],
        },
    },
    shortSlider: {
        slides: {
            type: [
                {
                    isImg: { type: Boolean, default: true },
                    image: { type: Object },
                    redirectUrl: { type: String, default: "" },
                    product: { type: mongoose_1.default.SchemaTypes.ObjectId, ref: "products" },
                },
            ],
            default: [],
        },
    },
}, { timestamps: true });
Slider.plugin(mSlug);
exports.default = mongoose_1.default.model("sliders", Slider);
