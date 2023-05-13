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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../../controllers");
const utils_1 = require("../../utils");
const isAdminAuth_1 = require("../middlewares/isAdminAuth");
const validator_1 = __importDefault(require("./validator"));
const router = (0, express_1.Router)();
router.post("/long-file", isAdminAuth_1.isAdmin, utils_1.fileHandler.uploadFile().any(), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let s3Images = yield utils_1.fileHandler.uploadLongSliderFilesToS3(req.files);
        let images = s3Images.map((f) => f.variant);
        utils_1.helper.buildResponse(res, "File Uploaded Successfully.", images);
    }
    catch (error) {
        next(error);
    }
}));
router.post("/short-file", isAdminAuth_1.isAdmin, utils_1.fileHandler.uploadFile().any(), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let s3Images = yield utils_1.fileHandler.uploadShortSliderFilesToS3(req.files);
        let images = s3Images.map((f) => f.variant);
        utils_1.helper.buildResponse(res, "File Uploaded Successfully.", images);
    }
    catch (error) {
        next(error);
    }
}));
router.post("", isAdminAuth_1.isAdmin, validator_1.default.addSlider, controllers_1.sliderCtrl.addSlider);
router.put("", isAdminAuth_1.isAdmin, validator_1.default.addSlider, controllers_1.sliderCtrl.updateSlider);
router.get("", validator_1.default.getSlider, controllers_1.sliderCtrl.getSlider);
router.delete("/:slideId", isAdminAuth_1.isAdmin, validator_1.default.deleteSliderSlide, controllers_1.sliderCtrl.deleteSliderSlide);
exports.default = router;
