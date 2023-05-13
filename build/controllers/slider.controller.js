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
const services_1 = require("../services");
const utils_1 = require("../utils");
/**
 * add slider data
 */
const addSlider = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        yield services_1.sliderService.addSlider(req, req.body);
        utils_1.helper.buildResponse(res, "Slider added successfully");
    }
    catch (error) {
        next(error);
    }
});
/**
 * update slider data
 */
const updateSlider = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        yield services_1.sliderService.updateSlider(req, req.body);
        utils_1.helper.buildResponse(res, "Slider updated successfully");
    }
    catch (error) {
        next(error);
    }
});
/**
 * delete slider slide
 */
const deleteSliderSlide = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        const result = yield services_1.sliderService.deleteSliderSlide(req, req.params.sliderId, req.params.slideId);
        utils_1.helper.buildResponse(res, "Slide deleted successfully", result);
    }
    catch (error) {
        next(error);
    }
});
/**
 * delete slider
 */
const deleteSlider = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        const result = yield services_1.sliderService.deleteSlider(req, req.params.sliderId);
        utils_1.helper.buildResponse(res, "Slider deleted successfully", result);
    }
    catch (error) {
        next(error);
    }
});
/**
 * get Slider
 */
const getSlider = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield services_1.sliderService.getSlider(req.query);
        utils_1.helper.buildResponse(res, "Slider Info fetched successfully", result);
    }
    catch (error) {
        next(error);
    }
});
exports.default = {
    addSlider,
    updateSlider,
    getSlider,
    deleteSliderSlide,
    deleteSlider,
};
