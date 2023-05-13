"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../../controllers");
const utils_1 = require("../../utils");
const interfaces_1 = require("../../utils/interfaces");
const isAdminAuth_1 = require("../middlewares/isAdminAuth");
const isAuth_1 = require("../middlewares/isAuth");
const isUserAuth_1 = require("../middlewares/isUserAuth");
const isVendorAuth_1 = require("../middlewares/isVendorAuth");
const validator_1 = __importDefault(require("./validator"));
const router = (0, express_1.Router)();
router.post("/became-a-vendor", isUserAuth_1.isUser, utils_1.fileHandler.uploadProductFilesToS3("vendors").fields([
    { name: "avatar", maxCount: 1 },
    { name: "images", maxCount: 5 },
    { name: "video", maxCount: 1 },
]), validator_1.default.becameAVendor, controllers_1.vendorCtrl.becameAVendor);
router.post("/complete-profile", isVendorAuth_1.isVendor, utils_1.fileHandler.uploadProductFilesToS3("vendors").fields([
    { name: "avatar", maxCount: 1 },
    { name: "images", maxCount: 5 },
    { name: "video", maxCount: 1 },
]), validator_1.default.completeVendorProfile, controllers_1.vendorCtrl.completeVendorProfile);
router.post("/", isAdminAuth_1.isAdmin, utils_1.fileHandler.uploadProductFilesToS3("vendors").fields([
    { name: "avatar", maxCount: 1 },
    { name: "images", maxCount: 5 },
    { name: "video", maxCount: 1 },
]), validator_1.default.addVendor, controllers_1.vendorCtrl.addVendor);
router.put("/:vendorId", isAdminAuth_1.isAdmin, validator_1.default.updateVendor, controllers_1.vendorCtrl.updateVendor);
router.put("/:vendorId/update-profile", isVendorAuth_1.isVendor, validator_1.default.updateVendorProfile, controllers_1.vendorCtrl.updateVendorProfile);
router.patch("/approve/:vendorId", isAdminAuth_1.isAdmin, validator_1.default.patchUpdateApproval, controllers_1.vendorCtrl.patchUpdateApproval);
router.delete("/:vendorId", isAdminAuth_1.isAdmin, validator_1.default.getVendor, controllers_1.vendorCtrl.deleteVendor);
router.get("/by-admin", isAdminAuth_1.isAdmin, validator_1.default.getVendors, controllers_1.vendorCtrl.getVendorsByAdmin);
router.get("/:vendorId", (0, isAuth_1.isAuth)([interfaces_1.UserRole.SUPER_ADMIN, interfaces_1.UserRole.ADMIN, interfaces_1.UserRole.VENDOR]), validator_1.default.getVendor, controllers_1.vendorCtrl.getVendor);
router.patch("/:vendorId", isAdminAuth_1.isAdmin, validator_1.default.updateVendorStatus, controllers_1.vendorCtrl.updateVendorStatus);
router.get("", validator_1.default.getVendors, controllers_1.vendorCtrl.getVendors);
router.get("/generate-new-password/:vendorId", isAdminAuth_1.isAdmin, controllers_1.vendorCtrl.generateNewPassword);
exports.default = router;
