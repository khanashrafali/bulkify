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
// sub category validations
const checkDuplicateMainCategory = (val, { req }) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    let conditions = { name: { $regex: utils_1.helper.regxEscape(val), $options: "i" } };
    if ((_a = req.params) === null || _a === void 0 ? void 0 : _a.categoryId)
        conditions._id = { $ne: (_b = req.params) === null || _b === void 0 ? void 0 : _b.categoryId };
    const category = yield models_1.mainCategoryModel.findOne(conditions);
    if (category)
        throw utils_1.helper.buildError("Same category name already exists", 400);
});
// main category validations
const postCreateMainCategory = [
    (0, express_validator_1.body)("name", "Please enter valid name")
        .exists()
        .trim()
        .notEmpty()
        .custom(checkDuplicateMainCategory),
    (0, express_validator_1.body)("image", "Please enter valid image").optional().isURL(),
];
const putUpdateMainCategory = [
    (0, express_validator_1.param)("categoryId", "Please enter valid category Id").exists().isMongoId(),
    (0, express_validator_1.body)("name", "Please enter valid name")
        .exists()
        .trim()
        .notEmpty()
        .custom(checkDuplicateMainCategory),
    (0, express_validator_1.body)("image", "Please enter valid image").optional().isURL(),
];
const getMainCategory = [
    (0, express_validator_1.param)("categoryId", "Please enter valid category Id").exists().isMongoId(),
];
const getMainCategories = [
    (0, express_validator_1.query)("createdAt", "Please enter valid createdAt").optional().isDate({
        format: utils_1.CONSTANT.DATE,
    }),
    (0, express_validator_1.query)("status", "Please enter valid status").optional().isIn(["true", "false"]).toBoolean(),
    (0, express_validator_1.query)("page", "Please enter valid page").optional().toInt().isInt({ gt: 0 }),
    (0, express_validator_1.query)("pageSize", "Please enter valid pageSize").optional().toInt().isInt({ gt: 0 }),
];
const deleteMainCategory = [
    (0, express_validator_1.param)("categoryId", "Please enter valid category Id").exists().isMongoId(),
];
const patchUpdateCategoryStatus = [
    (0, express_validator_1.param)("categoryId", "Please enter valid category Id").exists().isMongoId(),
    (0, express_validator_1.body)("status", "Please enter valid status").exists().isBoolean(),
];
exports.default = {
    postCreateMainCategory,
    putUpdateMainCategory,
    getMainCategory,
    getMainCategories,
    deleteMainCategory,
    patchUpdateCategoryStatus,
};
