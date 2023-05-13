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
const utils_1 = require("../../utils");
const userLogin = [
    (0, express_validator_1.oneOf)([
        (0, express_validator_1.body)("emailOrMobile").exists().trim().notEmpty().isMobilePhone("en-IN"),
        (0, express_validator_1.body)("emailOrMobile").exists().trim().notEmpty().isEmail().normalizeEmail(),
    ], "Please enter valid mobile number or email id"),
];
const userSignup = [
    (0, express_validator_1.body)("name", "Please enter valid name")
        .exists()
        .trim()
        .notEmpty()
        .isAlpha("en-IN", { ignore: [" ", "."] }),
    (0, express_validator_1.oneOf)([
        (0, express_validator_1.body)("emailOrMobile").exists().trim().notEmpty().isMobilePhone("en-IN"),
        (0, express_validator_1.body)("emailOrMobile").exists().trim().notEmpty().isEmail().normalizeEmail(),
    ], "Please enter valid mobile number or email id"),
];
const vendorSignup = [
    (0, express_validator_1.body)("email", "Please enter valid email").exists().trim().notEmpty().isEmail().normalizeEmail(),
    (0, express_validator_1.body)("password", `Password must be at least 8 digits and it should have 1 uppercase, 1 lowercase, 1 number and 1 special character`)
        .exists()
        .trim()
        .notEmpty()
        .matches(utils_1.CONSTANT.REGX.Password),
];
const resendOtp = [
    (0, express_validator_1.oneOf)([
        (0, express_validator_1.body)("emailOrMobile").exists().trim().notEmpty().isMobilePhone("en-IN"),
        (0, express_validator_1.body)("emailOrMobile").exists().trim().notEmpty().isEmail().normalizeEmail(),
    ], "Please enter valid mobile number or email id"),
];
const verifyOtp = [
    (0, express_validator_1.oneOf)([
        (0, express_validator_1.body)("emailOrMobile").exists().trim().notEmpty().isMobilePhone("en-IN"),
        (0, express_validator_1.body)("emailOrMobile").exists().trim().notEmpty().isEmail().normalizeEmail(),
    ], "Please enter valid mobile number or email id"),
    (0, express_validator_1.body)("otp", "Please enter valid otp").exists().trim().notEmpty(),
];
const adminSignup = [
    (0, express_validator_1.body)("email", "Please enter valid email").exists().trim().notEmpty().isEmail().normalizeEmail(),
    (0, express_validator_1.body)("password", `Password must be at least 8 digits and it should have 1 uppercase, 1 lowercase, 1 number and 1 special character`)
        .exists()
        .trim()
        .notEmpty()
        .matches(utils_1.CONSTANT.REGX.Password),
];
const resendAdminEmail = [(0, express_validator_1.body)("email", "Please enter valid email").exists().trim().notEmpty().isEmail().normalizeEmail()];
const verifyAdminEmail = [(0, express_validator_1.param)("token", "Please enter valid token").exists().trim().notEmpty()];
const resendVendorEmail = [(0, express_validator_1.body)("email", "Please enter valid email").exists().trim().notEmpty().isEmail().normalizeEmail()];
const verifyVendorEmail = [(0, express_validator_1.param)("token", "Please enter valid token").exists().trim().notEmpty()];
const adminLogin = [
    (0, express_validator_1.body)("email", "Please enter valid email").exists().trim().notEmpty().isEmail().normalizeEmail(),
    (0, express_validator_1.body)("password", `Please enter valid password`).exists().trim().notEmpty(),
];
const getValidateToken = [
    (0, express_validator_1.query)("token", "Please enter valid token").exists().trim().notEmpty(),
    (0, express_validator_1.query)("role", `Please enter valid role like ${utils_1.CONSTANT.USER_ROLES.join(", ")}`).isIn(utils_1.CONSTANT.USER_ROLES),
];
const vendorLogin = [
    (0, express_validator_1.body)("email", "Please enter valid email").exists().trim().notEmpty().isEmail().normalizeEmail(),
    (0, express_validator_1.body)("password", `Please enter valid password`).exists().trim().notEmpty(),
];
const changePassword = [
    (0, express_validator_1.body)("oldPassword", "Please enter valid oldPassword").exists(),
    (0, express_validator_1.body)("newPassword", `Password must be at least 8 digits and it should have 1 uppercase, 1 lowercase, 1 number and 1 special character`)
        .exists()
        .trim()
        .notEmpty()
        .matches(utils_1.CONSTANT.REGX.Password),
    (0, express_validator_1.body)("confirmPassword", "Please enter valid confirmPassword").exists().trim().notEmpty(),
];
const postReplacePassword = [
    (0, express_validator_1.body)("newPassword", `Password must be at least 8 digits and it should have 1 uppercase, 1 lowercase, 1 number and 1 special character`)
        .exists()
        .trim()
        .notEmpty()
        .matches(utils_1.CONSTANT.REGX.Password)
        .isLength({ max: 20 })
        .withMessage("password length must be less then 20"),
    (0, express_validator_1.body)("confirmPassword", "Please enter valid confirm confirmPassword")
        .exists()
        .trim()
        .notEmpty()
        .custom((val, { req }) => __awaiter(void 0, void 0, void 0, function* () {
        if (val !== req.body.newPassword)
            throw utils_1.helper.buildError("must match new Password and confirm password", 400);
    })),
];
const putResetAdminPassword = [(0, express_validator_1.param)("token", "Please enter valid token").exists().trim().notEmpty(), ...postReplacePassword];
const postSendAdminForgotPasswordMail = [...resendAdminEmail];
const putResetVendorPassword = [(0, express_validator_1.param)("token", "Please enter valid token").exists().trim().notEmpty(), ...postReplacePassword];
const postSendVendorForgotPasswordMail = [...resendAdminEmail];
exports.default = {
    userLogin,
    userSignup,
    resendOtp,
    verifyOtp,
    vendorLogin,
    vendorSignup,
    adminLogin,
    adminSignup,
    resendAdminEmail,
    verifyAdminEmail,
    resendVendorEmail,
    verifyVendorEmail,
    getValidateToken,
    changePassword,
    putResetAdminPassword,
    postSendAdminForgotPasswordMail,
    putResetVendorPassword,
    postSendVendorForgotPasswordMail,
};
