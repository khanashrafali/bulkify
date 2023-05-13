"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const addSlider = [
    (0, express_validator_1.body)("shortSlider.slides", "Please enter valid slides").optional().isArray({ min: 1 }),
    (0, express_validator_1.body)("shortSlider.slides.*.isImg", "Please enter valid slide isImg"),
    (0, express_validator_1.body)("shortSlider.slides.*.product", "Please enter valid slide product").optional().isMongoId(),
    (0, express_validator_1.body)("shortSlider.slides.*.image", "Please enter valid slide image").optional(),
    (0, express_validator_1.body)("shortSlider.slides.*.redirectUrl", "Please enter valid slide redirectUrl").optional().isURL(),
    (0, express_validator_1.body)("longSlider.slides", "Please enter valid slides").optional().isArray({ min: 1 }),
    (0, express_validator_1.body)("longSlider.slides.*.isImg", "Please enter valid slide isImg"),
    (0, express_validator_1.body)("longSlider.slides.*.product", "Please enter valid slide product").optional().isMongoId(),
    (0, express_validator_1.body)("longSlider.slides.*.image", "Please enter valid slide image").optional(),
    (0, express_validator_1.body)("longSlider.slides.*.redirectUrl", "Please enter valid slide redirectUrl").optional().isURL(),
];
const getSlider = [(0, express_validator_1.query)("sliderId", "Please enter valid sliderId").optional().isMongoId()];
const updateSlider = [...addSlider];
const deleteSliderSlide = [
    (0, express_validator_1.param)("sliderId", "Please enter valid sliderId").exists().isMongoId(),
    (0, express_validator_1.param)("slideId", "Please enter valid slide id").exists().isMongoId(),
];
const deleteSlider = [(0, express_validator_1.param)("sliderId", "Please enter valid sliderId").exists().isMongoId()];
exports.default = {
    addSlider,
    updateSlider,
    getSlider,
    deleteSliderSlide,
    deleteSlider,
};
