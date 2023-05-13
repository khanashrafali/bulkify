"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../models");
const utils_1 = require("../utils");
utils_1.helper.loadEnvFile();
const addSlider = (ireq, slider) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield models_1.sliderModel.create(slider);
    }
    catch (error) {
        throw error;
    }
});
const updateSlider = (ireq, sliderData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let slider = yield models_1.sliderModel.findOne({});
        if (!slider)
            throw utils_1.helper.buildError("no slider found with this id", 404);
        yield slider.set(sliderData).save();
    }
    catch (error) {
        throw error;
    }
});
// delete slider info
const deleteSlider = (ireq, slideId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let slider = yield models_1.sliderModel.findById(slideId);
        if (!slider)
            throw utils_1.helper.buildError("No slider found with this id", 404);
        yield slider.remove();
    }
    catch (error) {
        throw error;
    }
});
// delete slider slide info
const deleteSliderSlide = (ireq, sliderId, slideId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let slider = yield models_1.sliderModel.findById(sliderId);
        if (!slider)
            throw utils_1.helper.buildError("No slider found with this id", 404);
        let sliderObj = slider.toJSON();
        sliderObj.slides = sliderObj.slides.fliter((slide) => slide._id.toString() != slideId.toString());
        yield slider.set(Object.assign({}, sliderObj)).save();
    }
    catch (error) {
        throw error;
    }
});
// get slider info
const getSlider = (queryParams) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let data = yield models_1.sliderModel
            .findOne({})
            .populate({ path: "longSlider.slides.product", select: "name" })
            .populate({ path: "shortSlider.slides.product", select: "name" });
        if (data)
            return data;
        return yield models_1.sliderModel.create({ longSlider: { slides: [] }, shortSlider: { slides: [] } });
    }
    catch (error) {
        throw error;
    }
});
exports.default = {
    addSlider,
    updateSlider,
    deleteSliderSlide,
    deleteSlider,
    getSlider,
};
