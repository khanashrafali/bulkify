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
    let conditions = { name: { $regex: utils_1.helper.regxEscape(val), $options: "i" }, level: 0 };
    if ((_a = req.params) === null || _a === void 0 ? void 0 : _a.mainCategoryId)
        conditions._id = { $ne: (_b = req.params) === null || _b === void 0 ? void 0 : _b.mainCategoryId };
    const category = yield models_1.categoryModel.findOne(conditions);
    if (category)
        throw utils_1.helper.buildError("Same category name already exists", 400);
});
const checkDuplicateSubCategory = (val, { req }) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d;
    let mainCat = yield models_1.categoryModel.findOne({ _id: (_c = req.params) === null || _c === void 0 ? void 0 : _c.mainCategoryId }).populate({
        path: "subCategories",
        match: { name: { $regex: utils_1.helper.regxEscape(val), $options: "i" } },
    });
    if (!mainCat)
        throw utils_1.helper.buildError("No category found with this id", 400);
    if ((_d = mainCat === null || mainCat === void 0 ? void 0 : mainCat.subCategories) === null || _d === void 0 ? void 0 : _d.length)
        throw utils_1.helper.buildError("Same sub category name already exists", 400);
});
const checkDuplicateSubCategoryOnUpdate = (val, { req }) => __awaiter(void 0, void 0, void 0, function* () {
    var _e, _f, _g;
    let mainCat = yield models_1.categoryModel.findOne({ _id: (_e = req.params) === null || _e === void 0 ? void 0 : _e.categoryId }).populate({
        path: "subCategories",
        match: {
            _id: { $ne: (_f = req.body) === null || _f === void 0 ? void 0 : _f.subCategoryId },
            name: { $regex: utils_1.helper.regxEscape(val), $options: "i" },
        },
    });
    if (!mainCat)
        throw utils_1.helper.buildError("No category found with this id", 400);
    if ((_g = mainCat === null || mainCat === void 0 ? void 0 : mainCat.subCategories) === null || _g === void 0 ? void 0 : _g.length)
        throw utils_1.helper.buildError("Same sub category name already exists", 400);
});
const postCreateSubCategory = [
    (0, express_validator_1.param)("mainCategoryId", "Please enter valid main category id").exists().isMongoId(),
    (0, express_validator_1.body)("name", "Please enter valid name").exists().trim().notEmpty().custom(checkDuplicateSubCategory),
    (0, express_validator_1.body)("image", "Please enter valid image").optional().isObject(),
    (0, express_validator_1.body)("collectionIds", "Please enter valid collectionIds").optional({ checkFalsy: true }).isArray(),
    (0, express_validator_1.body)("collectionIds.*", "Please enter valid collectionIds").optional({ checkFalsy: true }).isMongoId(),
];
const putUpdateSubCategory = [
    (0, express_validator_1.param)("categoryId", "Please enter valid category Id").exists().isMongoId(),
    (0, express_validator_1.body)("subCategoryId", "Please enter valid category Id").exists().isMongoId(),
    (0, express_validator_1.body)("image", "Please enter valid image").optional().isObject(),
    (0, express_validator_1.body)("name", "Please enter valid name").exists().trim().notEmpty().custom(checkDuplicateSubCategoryOnUpdate),
    (0, express_validator_1.body)("collectionIds", "Please enter valid collectionIds").optional({ checkFalsy: true }).isArray(),
    (0, express_validator_1.body)("collectionIds.*", "Please enter valid collectionIds").optional({ checkFalsy: true }).isMongoId(),
];
const getSubCategory = [(0, express_validator_1.param)("subCategoryId", "Please enter valid category Id").exists().isMongoId()];
const getSubCategories = [(0, express_validator_1.param)("mainCategoryId", "Please enter valid category Id").exists().isMongoId()];
const deleteSubCategory = [(0, express_validator_1.param)("subCategoryId", "Please enter valid category Id").exists().isMongoId()];
// main category validations
const postCreateMainCategory = [
    (0, express_validator_1.body)("name", "Please enter valid name").exists().trim().notEmpty().custom(checkDuplicateMainCategory),
    (0, express_validator_1.body)("image", "Please enter valid image").optional().isObject(),
];
const putUpdateMainCategory = [
    (0, express_validator_1.param)("mainCategoryId", "Please enter valid category Id").exists().isMongoId(),
    (0, express_validator_1.body)("name", "Please enter valid name").exists().trim().notEmpty().custom(checkDuplicateMainCategory),
    (0, express_validator_1.body)("image", "Please enter valid image").optional().isObject(),
];
const getMainCategory = [(0, express_validator_1.param)("mainCategoryId", "Please enter valid category Id").exists().isMongoId()];
const getMainCategories = [
    (0, express_validator_1.query)("createdAt", "Please enter valid createdAt").optional().isDate({
        format: utils_1.CONSTANT.DATE,
    }),
    (0, express_validator_1.query)("status", "Please enter valid status").optional().isIn(["true", "false"]).toBoolean(),
    (0, express_validator_1.query)("page", "Please enter valid page").optional().toInt().isInt({ gt: 0 }),
    (0, express_validator_1.query)("pageSize", "Please enter valid pageSize").optional().toInt().isInt({ gt: 0 }),
];
const deleteMainCategory = [(0, express_validator_1.param)("mainCategoryId", "Please enter valid category Id").exists().isMongoId()];
const patchUpdateCategoryStatus = [
    (0, express_validator_1.param)("categoryId", "Please enter valid category Id").exists().isMongoId(),
    (0, express_validator_1.body)("status", "Please enter valid status").exists().isBoolean(),
];
exports.default = {
    postCreateSubCategory,
    postCreateMainCategory,
    putUpdateMainCategory,
    getMainCategory,
    getMainCategories,
    deleteMainCategory,
    putUpdateSubCategory,
    getSubCategory,
    getSubCategories,
    deleteSubCategory,
    patchUpdateCategoryStatus,
};
