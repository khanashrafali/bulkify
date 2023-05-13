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
const models_1 = require("../models");
const utils_1 = require("../utils");
utils_1.helper.loadEnvFile();
/**
 * create main category handler
 */
const createMainCategory = (name, status, image) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield models_1.mainCategoryModel.create({ name, status, image });
    }
    catch (error) {
        throw error;
    }
});
/**
 * update main category handler
 */
const updateMainCategory = (categoryId, name, status, image) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let data = { name, status };
        if (image)
            data.image = image;
        const category = yield models_1.mainCategoryModel.findById(categoryId);
        if (!category)
            throw utils_1.helper.buildError("No category found with this id", 404);
        return yield category.set(data).save();
    }
    catch (error) {
        throw error;
    }
});
/**
 * get single main category handler
 */
const getMainCategory = (categoryId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const category = yield models_1.mainCategoryModel.findOne({ _id: categoryId });
        if (!category)
            throw utils_1.helper.buildError("No category found with this id", 404);
        return category;
    }
    catch (error) {
        throw error;
    }
});
/**
 * get main categories by admin handler
 */
const getMainCategoriesByAdmin = (queryParams) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { textSearch, status, createdAt } = queryParams;
        let condition = {};
        const pageInfo = utils_1.helper.checkPagination(queryParams);
        if (textSearch && (textSearch === null || textSearch === void 0 ? void 0 : textSearch.length))
            condition.name = { $regex: utils_1.helper.regxEscape(textSearch), $options: "i" };
        if (status)
            condition.status = status;
        if (createdAt)
            condition.date = createdAt;
        const count = yield models_1.mainCategoryModel.countDocuments(condition);
        let docs = [];
        const mongoQuery = models_1.mainCategoryModel.find(condition).sort({ slug: 1 });
        if (pageInfo)
            docs = yield mongoQuery.skip(pageInfo.skip).limit(pageInfo.pageSize);
        else
            docs = yield mongoQuery;
        return utils_1.helper.makePaginatedData(docs, count, pageInfo);
    }
    catch (error) {
        throw error;
    }
});
/**
 * get main categories handler
 */
const getMainCategories = (queryParams) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { textSearch, status, createdAt } = queryParams;
        let condition = { status: true };
        const pageInfo = utils_1.helper.checkPagination(queryParams);
        if (textSearch && (textSearch === null || textSearch === void 0 ? void 0 : textSearch.length))
            condition.name = { $regex: utils_1.helper.regxEscape(textSearch), $options: "i" };
        if (status)
            condition.status = status;
        if (createdAt)
            condition.date = createdAt;
        const count = yield models_1.mainCategoryModel.countDocuments(condition);
        let docs = [];
        const mongoQuery = models_1.mainCategoryModel.find(condition).sort({ name: 1 });
        if (pageInfo)
            docs = yield mongoQuery.skip(pageInfo.skip).limit(pageInfo.pageSize);
        else
            docs = yield mongoQuery;
        return utils_1.helper.makePaginatedData(docs, count, pageInfo);
    }
    catch (error) {
        throw error;
    }
});
/**
 * delete main category handler
 */
const deleteMainCategory = (categoryId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        let category = yield models_1.mainCategoryModel
            .findOne({ _id: categoryId })
            .populate({ path: "subCategories", match: { status: true } });
        if (!category)
            throw utils_1.helper.buildError("No category found with this id", 404);
        const catToJSON = category.toJSON();
        if (catToJSON.status)
            throw utils_1.helper.buildError("You are not allowed to delete this category as status is active", 400);
        if ((_a = catToJSON.subCategories) === null || _a === void 0 ? void 0 : _a.length)
            throw utils_1.helper.buildError("Please delete all the sub categories first", 400);
        return yield category.delete();
    }
    catch (error) {
        throw error;
    }
});
/**
 * create sub category handler
 */
const createSubCategory = (mainCategoryId, name, status, image) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let mainCat = yield models_1.mainCategoryModel.findById(mainCategoryId);
        if (!mainCat)
            throw utils_1.helper.buildError("No main category found with this id", 404);
        const mainCatToJson = mainCat.toJSON();
        yield models_1.mainCategoryModel.create({ name, status, image });
    }
    catch (error) {
        throw error;
    }
});
/**
 * update sub/main category status handler
 */
const updateCategoryStatus = (categoryId, status) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let category = yield models_1.mainCategoryModel.findOne({ _id: categoryId });
        if (!category)
            throw utils_1.helper.buildError("No category found with this id", 404);
        return yield category.set({ status }).save();
    }
    catch (error) {
        throw error;
    }
});
exports.default = {
    createMainCategory,
    updateMainCategory,
    getMainCategory,
    getMainCategories,
    deleteMainCategory,
    createSubCategory,
    updateCategoryStatus,
    getMainCategoriesByAdmin,
};
