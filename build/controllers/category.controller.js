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
const services_1 = require("../services");
const utils_1 = require("../utils");
/**
 * create main category api
 */
const postCreateMainCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        const result = yield services_1.categoryService.createMainCategory(req.body.name, req.body.status, req.body.image, req.user._id);
        utils_1.helper.buildResponse(res, "Category created successfully", result);
    }
    catch (error) {
        next(error);
    }
});
/**
 * update main category api
 */
const putUpdateMainCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        const result = yield services_1.categoryService.updateMainCategory(req.params.mainCategoryId, req.body.name, req.body.status, req.body.image, req.body.collectionIds);
        utils_1.helper.buildResponse(res, "Category updated successfully", result);
    }
    catch (error) {
        next(error);
    }
});
/**
 * get single main category api
 */
const getMainCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        const result = yield services_1.categoryService.getMainCategory(req.params.mainCategoryId);
        utils_1.helper.buildResponse(res, "Category fetched successfully", result);
    }
    catch (error) {
        next(error);
    }
});
/**
 * get main category list by admin api
 */
const getMainCategoriesByAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        const result = yield services_1.categoryService.getMainCategoriesByAdmin(req.query);
        utils_1.helper.buildResponse(res, "Categories fetched sucessfully", result);
    }
    catch (error) {
        next(error);
    }
});
/**
 * get main category list by user api
 */
const getMainCategories = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        const result = yield services_1.categoryService.getMainCategories(req.query);
        utils_1.helper.buildResponse(res, "Categories fetched sucessfully", result);
    }
    catch (error) {
        next(error);
    }
});
/**
 * delete main category api
 */
const deleteMainCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        const result = yield services_1.categoryService.deleteMainCategory(req.params.mainCategoryId);
        utils_1.helper.buildResponse(res, "Category deleted sucessfully", result);
    }
    catch (error) {
        next(error);
    }
});
/**
 * create sub category api
 */
const postCreateSubCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const image = (_a = req === null || req === void 0 ? void 0 : req.file) === null || _a === void 0 ? void 0 : _a.Location;
    try {
        utils_1.helper.handlePayloadError(req);
        const result = yield services_1.categoryService.createSubCategory(req.params.mainCategoryId, req.body.name, req.body.status, req.body.image, req.body.collectionIds, req.user._id);
        utils_1.helper.buildResponse(res, "Sub category created sucessfully", result);
    }
    catch (error) {
        next(error);
    }
});
/**
 * update sub category api
 */
const putUpdateSubCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        const result = yield services_1.categoryService.updateSubCategory(req.body.subCategoryId, req.body);
        utils_1.helper.buildResponse(res, "Sub category updated sucessfully", result);
    }
    catch (error) {
        next(error);
    }
});
/**
 * get single sub category api
 */
const getSubCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        const result = yield services_1.categoryService.getSubCategory(req.params.subCategoryId);
        utils_1.helper.buildResponse(res, "Sub category fetched sucessfully", result);
    }
    catch (error) {
        next(error);
    }
});
/**
 * get sub category list by admin api
 */
const getSubCategoriesByAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        const result = yield services_1.categoryService.getSubCategoriesByAdmin(req.params.mainCategoryId, req.query);
        utils_1.helper.buildResponse(res, "Sub categories fetched sucessfully", result);
    }
    catch (error) {
        next(error);
    }
});
/**
 * get sub category list api
 */
const getSubCategories = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        const result = yield services_1.categoryService.getSubCategories(req.params.mainCategoryId, req.query);
        utils_1.helper.buildResponse(res, "Sub categories fetched sucessfully", result);
    }
    catch (error) {
        next(error);
    }
});
/**
 * delete sub category api
 */
const deleteSubCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        const result = yield services_1.categoryService.deleteSubCategory(req.params.subCategoryId);
        utils_1.helper.buildResponse(res, "Sub category deleted sucessfully", result);
    }
    catch (error) {
        next(error);
    }
});
/**
 * update category status api
 */
const patchUpdateCategoryStatus = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        const result = yield services_1.categoryService.updateCategoryStatus(req.params.categoryId, req.body.status);
        utils_1.helper.buildResponse(res, "Category status updated sucessfully", result);
    }
    catch (error) {
        next(error);
    }
});
exports.default = {
    postCreateMainCategory,
    putUpdateMainCategory,
    getMainCategory,
    getMainCategories,
    deleteMainCategory,
    postCreateSubCategory,
    putUpdateSubCategory,
    getSubCategory,
    getSubCategories,
    deleteSubCategory,
    patchUpdateCategoryStatus,
    getMainCategoriesByAdmin,
    getSubCategoriesByAdmin,
};
