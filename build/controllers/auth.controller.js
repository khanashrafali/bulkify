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
const express_validator_1 = require("express-validator");
const services_1 = require("../services");
const utils_1 = require("../utils");
/**
 * get my account details
 */
const getMyInfo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        let result = yield services_1.authService.getMyInfo(req);
        utils_1.helper.buildResponse(res, "account details", result);
    }
    catch (error) {
        next(error);
    }
});
/**
 * login user api
 */
const userLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        yield services_1.authService.userLogin(req.body.emailOrMobile, res);
    }
    catch (error) {
        next(error);
    }
});
/**
 * signup user api
 */
const userSignup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        let result = yield services_1.authService.userSignup(req.body.name, req.body.emailOrMobile);
        utils_1.helper.buildResponse(res, "Please verify the OTP sent to your mobile number", result);
    }
    catch (error) {
        next(error);
    }
});
/**
 * verify mobile otp api
 */
const verifyOtp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        let result = yield services_1.authService.verifyOtp(req.body.emailOrMobile, req.body.otp);
        utils_1.helper.buildResponse(res, "OTP verified successfully", result);
    }
    catch (error) {
        next(error);
    }
});
/**
 * resend mobile otp api
 */
const resendOtp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        let result = yield services_1.authService.resendOtp(req.body.emailOrMobile);
        utils_1.helper.buildResponse(res, `OTP has been sent to your registered Email ID/Mobile No.`, result);
    }
    catch (error) {
        next(error);
    }
});
/**
 * admin login api
 */
const adminLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        let result = yield services_1.authService.adminLogin(req.body.email, req.body.password);
        utils_1.helper.buildResponse(res, "You are successfully logged in", result);
    }
    catch (error) {
        next(error);
    }
});
/**
 * admin signup api
 */
const adminSignup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        let result = yield services_1.authService.adminSignup(req.body.email, req.body.password, req.body.confirmPassword);
        utils_1.helper.buildResponse(res, "Please verify email to registered successfully", result);
    }
    catch (error) {
        next(error);
    }
});
/**
 * verify email api
 */
const verifyAdminEmail = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        let result = yield services_1.authService.verifyAdminEmail(req.params.token);
        utils_1.helper.buildResponse(res, "Email Verified Successfully!", result);
    }
    catch (error) {
        next(error);
    }
});
/**
 * resend email api
 */
const resendAdminEmail = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        let result = yield services_1.authService.resendAdminEmail(req.body.email);
        utils_1.helper.buildResponse(res, "Email sent successfully", result);
    }
    catch (error) {
        next(error);
    }
});
/**
 * upload files api
 */
const postUploadFiles = (req, res, next) => {
    try {
        utils_1.helper.checkPayloadFiles(req);
        utils_1.helper.buildResponse(res, "Files uploaded Successfully", req.files || req.file);
    }
    catch (error) {
        next(error);
    }
};
/**
 * vendor login user api
 */
const vendorLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        let result = yield services_1.authService.vendorLogin(req.body.email, req.body.password);
        utils_1.helper.buildResponse(res, "You are successfully logged in", result);
    }
    catch (error) {
        next(error);
    }
});
/**
 * vendor signup user api
 */
const vendorSignup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        let result = yield services_1.authService.vendorSignup(req.body.email, req.body.password, req.body.confirmPassword);
        utils_1.helper.buildResponse(res, "Please verify email to registered successfully", result);
    }
    catch (error) {
        next(error);
    }
});
/**
 * verify vendor email api
 */
const verifyVendorEmail = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        let result = yield services_1.authService.verifyVendorEmail(req.params.token);
        utils_1.helper.buildResponse(res, "Email Verified Successfully!", result);
    }
    catch (error) {
        next(error);
    }
});
/**
 * resend vendor email api
 */
const resendVendorEmail = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        let result = yield services_1.authService.resendVendorEmail(req.body.email);
        utils_1.helper.buildResponse(res, "Email sent successfully", result);
    }
    catch (error) {
        next(error);
    }
});
// validate auth token
const getValidateToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        let result = yield services_1.authService.verifyAuthToken(req.query.token, req.query.role);
        utils_1.helper.buildResponse(res, "Token validated successfully", { isValid: result });
    }
    catch (error) {
        next(error);
    }
});
const vendorChangePassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        yield services_1.authService.changePassword(req, (0, express_validator_1.matchedData)(req));
        utils_1.helper.buildResponse(res, "Password changed successfully");
    }
    catch (error) {
        next(error);
    }
});
const adminChangePassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        yield services_1.authService.changePassword(req, (0, express_validator_1.matchedData)(req));
        utils_1.helper.buildResponse(res, "Password changed successfully");
    }
    catch (error) {
        next(error);
    }
});
/**
 * reset admin password
 */
const putResetAdminPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        let result = yield services_1.authService.resetAdminPassword(req.params.token, req.body.confirmPassword);
        utils_1.helper.buildResponse(res, "New password set successfully", result);
    }
    catch (error) {
        next(error);
    }
});
/**
 * reset vendor password
 */
const putResetVendorPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        let result = yield services_1.authService.resetVendorPassword(req.params.token, req.body.confirmPassword);
        utils_1.helper.buildResponse(res, "New password set successfully", result);
    }
    catch (error) {
        next(error);
    }
});
/**
 * sen  email for admin forgot password
 */
const postSendAdminForgotPasswordMail = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        let result = yield services_1.authService.sendAdminForgotPasswordEmail(req.body.email);
        utils_1.helper.buildResponse(res, "Verification link sent to your email, Please check", result);
    }
    catch (error) {
        next(error);
    }
});
/**
 * send email for vendor forgot password
 */
const postSendVendorForgotPasswordMail = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        let result = yield services_1.authService.sendVendorForgotPasswordEmail(req.body.email);
        utils_1.helper.buildResponse(res, "Verification link sent to your email, Please check", result);
    }
    catch (error) {
        next(error);
    }
});
exports.default = {
    userLogin,
    userSignup,
    verifyOtp,
    resendOtp,
    adminLogin,
    adminSignup,
    vendorLogin,
    vendorSignup,
    verifyAdminEmail,
    resendAdminEmail,
    verifyVendorEmail,
    resendVendorEmail,
    postUploadFiles,
    getValidateToken,
    getMyInfo,
    vendorChangePassword,
    adminChangePassword,
    putResetAdminPassword,
    putResetVendorPassword,
    postSendAdminForgotPasswordMail,
    postSendVendorForgotPasswordMail,
};
