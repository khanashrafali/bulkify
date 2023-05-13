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
const models_1 = require("../../models");
const utils_1 = require("../../utils");
const checkEmail = (val, { req }) => __awaiter(void 0, void 0, void 0, function* () {
    let iReq = req;
    let userObj = iReq.user.toJSON();
    let user = yield models_1.userModel.findOne({ _id: { $ne: userObj._id }, email: val });
    if (user)
        throw utils_1.helper.buildError("Email already taken", 400);
});
const checkMobile = (val, { req }) => __awaiter(void 0, void 0, void 0, function* () {
    let iReq = req;
    let userObj = iReq.user.toJSON();
    let user = yield models_1.userModel.findOne({ _id: { $ne: userObj._id }, mobileNumber: val });
    if (user)
        throw utils_1.helper.buildError("Mobile Number already taken", 400);
});
const getUsers = [
    (0, express_validator_1.query)("createdAt", "Please enter valid createdAt").optional().isDate({ format: utils_1.CONSTANT.DATE }),
    (0, express_validator_1.query)("page", "Please enter valid page").optional().toInt().isInt({ gt: 0 }),
    (0, express_validator_1.query)("pageSize", "Please enter valid pageSize").optional().toInt().isInt({ gt: 0 }),
];
const postSubscribe = [(0, express_validator_1.body)("email", "Please enter valid email").exists().notEmpty().isEmail().normalizeEmail()];
const updateStatus = [
    (0, express_validator_1.param)("userId", "Please enter valid userId").exists().isMongoId(),
    (0, express_validator_1.body)("status", "Please enter valid status").exists().isBoolean(),
];
const updateProfile = [
    (0, express_validator_1.body)("email", "Please enter valid email").exists().trim().notEmpty().isEmail().normalizeEmail().custom(checkEmail),
    (0, express_validator_1.body)("name", "Please enter valid name")
        .exists()
        .trim()
        .notEmpty()
        .isLength({ max: 100 })
        .withMessage("Length must be less then 100")
        .isAlpha("en-IN", { ignore: [".", " ", "_"] }),
    (0, express_validator_1.body)("mobileNumber", "Please enter valid mobileNumber")
        .exists()
        .trim()
        .notEmpty()
        .isMobilePhone("en-IN")
        .custom(checkMobile),
    (0, express_validator_1.body)("dob", "Please enter valid dob").optional().trim().notEmpty().isDate({
        format: utils_1.CONSTANT.DATE,
    }),
];
const postUserFeedback = [
    (0, express_validator_1.body)("email", "Please enter valid email").exists().isEmail().normalizeEmail(),
    (0, express_validator_1.body)("name", "Please enter valid name").exists().trim().notEmpty(),
    (0, express_validator_1.body)("phone", "Please enter valid phone").exists().isMobilePhone("en-IN"),
];
exports.default = {
    getUsers,
    postSubscribe,
    updateStatus,
    updateProfile,
    postUserFeedback,
};
