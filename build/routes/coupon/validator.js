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
const moment_1 = __importDefault(require("moment"));
const express_validator_1 = require("express-validator");
const models_1 = require("../../models");
const utils_1 = require("../../utils");
const checkDuplicateCode = (val, { req }) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    let conditions = { code: val };
    if ((_a = req.params) === null || _a === void 0 ? void 0 : _a.couponId)
        conditions._id = { $ne: (_b = req.params) === null || _b === void 0 ? void 0 : _b.couponId };
    const coupon = yield models_1.couponModel.findOne(conditions);
    if (coupon)
        throw utils_1.helper.buildError("Same coupon code already exists", 400);
});
const checkStartEndDate = (val, { req }) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    if (!((_c = req.params) === null || _c === void 0 ? void 0 : _c.couponId) && (0, moment_1.default)(req.body.startDate).isBefore((0, moment_1.default)(), "date")) {
        throw utils_1.helper.buildError("Start date should be greater or equal to current Date", 400);
    }
    if ((0, moment_1.default)(val).isBefore(req.body.startDate, "date")) {
        throw utils_1.helper.buildError("Start date should be less then end date", 400);
    }
});
const postAddCoupon = [
    (0, express_validator_1.body)("code", "Please enter valid code")
        .exists()
        .trim()
        .notEmpty()
        .isLength({ max: 20 })
        .withMessage("Code should be less or equal to 20 character")
        .custom(checkDuplicateCode),
    (0, express_validator_1.body)("discountInPercent", "Please enter valid discountInPercent").exists().isFloat({ gt: 0, lt: 101 }),
    (0, express_validator_1.body)("startDate", "Please enter valid startDate").exists().isDate({ format: utils_1.CONSTANT.DATE }),
    (0, express_validator_1.body)("endDate", "Please enter valid endDate").exists().isDate({ format: utils_1.CONSTANT.DATE }).custom(checkStartEndDate),
    (0, express_validator_1.body)("numberOfUsers", "Please enter valid numberOfUsers").exists().isInt({ gt: 0 }),
    (0, express_validator_1.body)("isPrivate", "Please enter valid isPrivate").exists().isBoolean(),
];
const putUpdateCoupon = [(0, express_validator_1.param)("couponId", "Please enter valid couponId").exists().isMongoId(), ...postAddCoupon];
const patchUpdateCouponStatus = [
    (0, express_validator_1.param)("couponId", "Please enter valid couponId").exists().isMongoId(),
    (0, express_validator_1.body)("isPrivate", "Please enter valid isPrivate").exists().trim().notEmpty(),
];
const deleteCoupon = [(0, express_validator_1.param)("couponId", "Please enter valid couponId").exists().isMongoId()];
const getCoupon = [(0, express_validator_1.param)("couponId", "Please enter valid couponId").exists().isMongoId()];
const getCoupons = [
    (0, express_validator_1.query)("endDate", "Please enter valid endDate").optional().isDate({ format: utils_1.CONSTANT.DATE }),
    (0, express_validator_1.query)("startDate", "Please enter valid startDate").optional().isDate({ format: utils_1.CONSTANT.DATE }),
    (0, express_validator_1.query)("discountInPercent", "Please enter valid discountInPercent").optional().toInt(),
    (0, express_validator_1.query)("numberOfUsers", "Please enter valid numberOfUsers").optional().toInt(),
    (0, express_validator_1.query)("createdAt", "Please enter valid createdAt").optional().isDate({ format: utils_1.CONSTANT.DATE }),
    (0, express_validator_1.query)("status", "Please enter valid status").optional().isIn(["true", "false"]).toBoolean(),
    (0, express_validator_1.query)("page", "Please enter valid page").optional().toInt().isInt({ gt: 0 }),
    (0, express_validator_1.query)("pageSize", "Please enter valid pageSize").optional().toInt().isInt({ gt: 0 }),
];
exports.default = {
    postAddCoupon,
    putUpdateCoupon,
    patchUpdateCouponStatus,
    deleteCoupon,
    getCoupon,
    getCoupons,
};
