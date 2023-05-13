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
const checkDuplicateVendorbuesnessName = (val, { req }) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    let conditions = {
        businessName: { $regex: new RegExp(`^${utils_1.helper.regxEscape(val)}$`), $options: "i" },
    };
    if ((_a = req.params) === null || _a === void 0 ? void 0 : _a.vendorId)
        conditions._id = { $ne: (_b = req.params) === null || _b === void 0 ? void 0 : _b.vendorId };
    const vendor = yield models_1.vendorModel.findOne(conditions);
    if (vendor)
        throw utils_1.helper.buildError("Same vendor Business Name already exists", 400);
});
const checkDuplicateVendorMobileNumber = (val, { req }) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d;
    let conditions = { mobileNumber: val };
    if ((_c = req.params) === null || _c === void 0 ? void 0 : _c.vendorId)
        conditions._id = { $ne: (_d = req.params) === null || _d === void 0 ? void 0 : _d.vendorId };
    const vendor = yield models_1.vendorModel.findOne(conditions);
    if (vendor)
        throw utils_1.helper.buildError("Same vendor mobile number already exists", 400);
});
const checkDuplicateVendorEmail = (val, { req }) => __awaiter(void 0, void 0, void 0, function* () {
    var _e, _f;
    let conditions = { email: val };
    if ((_e = req.params) === null || _e === void 0 ? void 0 : _e.vendorId)
        conditions._id = { $ne: (_f = req.params) === null || _f === void 0 ? void 0 : _f.vendorId };
    const vendor = yield models_1.vendorModel.findOne(conditions);
    if (vendor)
        throw utils_1.helper.buildError("Same vendor email already exists", 400);
});
const becameAVendor = [
    (0, express_validator_1.body)("gstNumber", "Please enter valid gst number.").optional({ checkFalsy: true }).trim().matches(utils_1.CONSTANT.REGX.GST),
    (0, express_validator_1.body)("panNumber", "Please enter valid pan number.").optional({ checkFalsy: true }).trim().matches(utils_1.CONSTANT.REGX.PAN),
    (0, express_validator_1.body)("address", "Please enter valid address").exists().trim().notEmpty(),
    (0, express_validator_1.body)("mobileNumber", "Please enter valid mobileNumber")
        .exists()
        .trim()
        .notEmpty()
        .isMobilePhone("en-IN")
        .custom(checkDuplicateVendorMobileNumber),
    (0, express_validator_1.body)("name", "Please enter valid name").exists().trim().notEmpty(),
    (0, express_validator_1.body)("email", "Please enter valid email").exists().trim().isEmail().normalizeEmail(),
    (0, express_validator_1.body)("businessType", "Please enter valid business type").exists().trim().notEmpty(),
    (0, express_validator_1.body)("bankDetails.accountHolderName", "Please enter valid accountHolderName").exists().trim().notEmpty(),
    (0, express_validator_1.body)("bankDetails.ifscCode", "Please enter valid ifscCode").exists().trim().notEmpty(),
    (0, express_validator_1.body)("bankDetails.bankName", "Please enter valid bankName").exists().trim().notEmpty(),
    (0, express_validator_1.body)("bankDetails.accountNumber", "Please enter valid accountNumber").exists().trim().notEmpty(),
    (0, express_validator_1.body)("images", "Please enter valid images").exists().isArray({ min: 1 }),
    (0, express_validator_1.body)("images.*", "Please enter valid image url").optional().isObject(),
    (0, express_validator_1.body)("video", "Please enter valid video").exists().trim().isObject(),
    (0, express_validator_1.body)("avatar", "Please enter valid avatar").exists().trim().isObject(),
];
const completeVendorProfile = [...becameAVendor];
const addVendor = [...becameAVendor];
const updateVendor = [(0, express_validator_1.param)("vendorId", "Please enter valid vendorId").exists().isMongoId(), ...becameAVendor];
const getVendor = [(0, express_validator_1.param)("vendorId", "Please enter valid vendorId").exists().isMongoId()];
const getVendors = [
    (0, express_validator_1.query)("isApproved", `Please enter valid ${utils_1.CONSTANT.APPROVAL_STATUS.join(",")}`)
        .optional()
        .isIn(utils_1.CONSTANT.APPROVAL_STATUS),
    (0, express_validator_1.query)("isVendorProfileComplete", "Please enter valid isVendorProfileComplete like true,false")
        .optional()
        .isIn(["true", "false"])
        .toBoolean(),
    (0, express_validator_1.query)("createdAt", "Please enter valid createdAt").optional().isDate({
        format: utils_1.CONSTANT.DATE,
    }),
    (0, express_validator_1.query)("isActive", "Please enter valid isActive  ").optional().isIn(["true", "false"]).toBoolean(),
    (0, express_validator_1.query)("page", "Please enter valid page").optional().toInt().isInt({ gt: 0 }),
    (0, express_validator_1.query)("pageSize", "Please enter valid pageSize").optional().toInt().isInt({ gt: 0 }),
];
const updateVendorStatus = [
    (0, express_validator_1.param)("vendorId", "Please enter valid vendorId").exists().isMongoId(),
    (0, express_validator_1.body)("status", "Please enter valid isActive like true, false").exists().isBoolean(),
];
const patchUpdateApproval = [
    (0, express_validator_1.param)("vendorId", "Please enter valid vendorId").exists().isMongoId(),
    (0, express_validator_1.body)("isApproved", `Please enter valid status like ${utils_1.CONSTANT.APPROVAL_STATUS.join(", ")}`)
        .exists()
        .isIn(utils_1.CONSTANT.APPROVAL_STATUS),
];
const updateVendorProfile = [
    ...becameAVendor,
    (0, express_validator_1.body)("avatar", "Please enter valid avatar").exists().isURL(),
    (0, express_validator_1.body)("video", "Please enter valid video").exists().isURL(),
    (0, express_validator_1.body)("images", "Please enter valid images").exists().isArray({ min: 1 }),
    (0, express_validator_1.body)("images.*", "Please enter valid image").exists().isURL(),
];
exports.default = {
    completeVendorProfile,
    addVendor,
    getVendor,
    getVendors,
    updateVendor,
    becameAVendor,
    updateVendorStatus,
    patchUpdateApproval,
    updateVendorProfile,
};
