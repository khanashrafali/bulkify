"use strict";
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
router.post("", isAdminAuth_1.isAdmin, utils_1.fileHandler.uploadAdsFilesToS3("ads").single("file"), validator_1.default.addAds, controllers_1.adsController.addAds);
router.get("", controllers_1.adsController.getAdss);
router.put("/:adsId", isAdminAuth_1.isAdmin, utils_1.fileHandler.uploadAdsFilesToS3("ads").single("file"), validator_1.default.updateAds, controllers_1.adsController.updateAds);
router.get("/:adsId", validator_1.default.getAds, controllers_1.adsController.getAds);
router.delete("/:adsId", isAdminAuth_1.isAdmin, validator_1.default.deleteAds, controllers_1.adsController.deleteAds);
exports.default = router;
