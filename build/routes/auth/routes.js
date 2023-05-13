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
const isVendorAuth_1 = require("../middlewares/isVendorAuth");
const validator_1 = __importDefault(require("./validator"));
const router = (0, express_1.Router)();
router.get("/me", (0, isAuth_1.isAuth)([interfaces_1.UserRole.SUPER_ADMIN, interfaces_1.UserRole.ADMIN, interfaces_1.UserRole.VENDOR, interfaces_1.UserRole.USER]), controllers_1.authCtrl.getMyInfo);
router.get("/token/validate", validator_1.default.getValidateToken, controllers_1.authCtrl.getValidateToken);
router.post("/app-login", validator_1.default.userLogin, controllers_1.authCtrl.userLogin);
router.post("/app-signup", validator_1.default.userSignup, controllers_1.authCtrl.userSignup);
router.post("/resend-otp", validator_1.default.resendOtp, controllers_1.authCtrl.resendOtp);
router.post("/verify-otp", validator_1.default.verifyOtp, controllers_1.authCtrl.verifyOtp);
//vendor auth apis
router.post("/vendor-login", validator_1.default.vendorLogin, controllers_1.authCtrl.vendorLogin);
router.post("/vendor-signup", validator_1.default.vendorSignup, controllers_1.authCtrl.vendorSignup);
router.post("/vendor-change-password", isVendorAuth_1.isVendor, validator_1.default.changePassword, controllers_1.authCtrl.vendorChangePassword);
router.post("/resend-vendor-email", validator_1.default.resendVendorEmail, controllers_1.authCtrl.resendVendorEmail);
router.get("/verify-vendor-email/:token", validator_1.default.verifyVendorEmail, controllers_1.authCtrl.verifyVendorEmail);
router.put("/vendor-reset-password/:token", validator_1.default.putResetAdminPassword, controllers_1.authCtrl.putResetVendorPassword);
router.post("/vendor-forgot-password-mail", validator_1.default.postSendVendorForgotPasswordMail, controllers_1.authCtrl.postSendVendorForgotPasswordMail);
// admin auth apis
router.post("/admin-login", validator_1.default.adminLogin, controllers_1.authCtrl.adminLogin);
router.post("/admin-signup", validator_1.default.adminSignup, controllers_1.authCtrl.adminSignup);
router.post("/admin-change-password", isAdminAuth_1.isAdmin, validator_1.default.changePassword, controllers_1.authCtrl.adminChangePassword);
router.put("/admin-reset-password/:token", validator_1.default.putResetAdminPassword, controllers_1.authCtrl.putResetAdminPassword);
router.post("/admin-forgot-password-mail", validator_1.default.postSendAdminForgotPasswordMail, controllers_1.authCtrl.postSendAdminForgotPasswordMail);
router.post("/resend-admin-email", validator_1.default.resendAdminEmail, controllers_1.authCtrl.resendAdminEmail);
router.get("/verify-admin-email/:token", validator_1.default.verifyAdminEmail, controllers_1.authCtrl.verifyAdminEmail);
router.post("/upload-files", (0, isAuth_1.isAuth)([interfaces_1.UserRole.SUPER_ADMIN, interfaces_1.UserRole.ADMIN, interfaces_1.UserRole.VENDOR, interfaces_1.UserRole.USER]), utils_1.fileHandler.uploadProductFilesToS3("files").any(), controllers_1.authCtrl.postUploadFiles);
exports.default = router;
