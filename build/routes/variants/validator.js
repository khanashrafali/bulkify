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
const models_1 = require("../../models");
const interfaces_1 = require("../../utils/interfaces");
const allowedRoles = utils_1.CONSTANT.USER_ROLES.filter((v) => v != interfaces_1.UserRole.ADMIN);
const checkVariantName = (val, { req }) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let variantId = (_a = req.params) === null || _a === void 0 ? void 0 : _a.variantId;
    let conditions = { variantName: { $regex: utils_1.helper.regxEscape(val), $options: "i" } };
    if (variantId)
        conditions._id = { $ne: variantId };
    let v = yield models_1.variantModel.findOne(conditions);
    if (v)
        throw utils_1.helper.buildError("same variant already exists", 400);
});
const getVariant = [(0, express_validator_1.param)("variantId", "Please enter valid variantId").exists().isMongoId()];
const addVariant = [
    (0, express_validator_1.body)("status", "Please enter valid status").exists().isBoolean().toBoolean(),
    (0, express_validator_1.body)("categories", "Please enter valid categories").exists().isArray({ min: 1 }),
    (0, express_validator_1.body)("categories.*", "Please enter valid category").exists().isMongoId(),
    (0, express_validator_1.body)("variantName", "Please enter valid variantName").exists().trim().notEmpty().custom(checkVariantName),
    (0, express_validator_1.body)("variantDescription", "Please enter valid variantDescription").exists().trim(),
    (0, express_validator_1.body)("values", "Please enter valid values").exists().isArray({ min: 1 }),
    (0, express_validator_1.body)("values.*", "Please enter valid value's value").exists().trim().notEmpty(),
];
const updateVariant = [...getVariant, ...addVariant];
const deleteVariant = [...getVariant];
const getVariants = [
    (0, express_validator_1.query)("status", "Please enter valid status").optional().toBoolean(),
    (0, express_validator_1.query)("category", "Please enter valid category").optional().isMongoId(),
];
const updateVariantStatus = [
    ...getVariant,
    (0, express_validator_1.body)("status", "Please enter valid status").exists().isBoolean().toBoolean(),
];
exports.default = {
    addVariant,
    updateVariant,
    getVariant,
    deleteVariant,
    getVariants,
    updateVariantStatus,
};
