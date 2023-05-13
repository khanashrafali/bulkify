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
        const result = yield services_1.mainCatService.createMainCategory(req.body.name, req.body.status, req.body.image);
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
        const result = yield services_1.mainCatService.updateMainCategory(req.params.categoryId, req.body.name, req.body.status, req.body.image);
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
        const result = yield services_1.mainCatService.getMainCategory(req.params.categoryId);
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
        const result = yield services_1.mainCatService.getMainCategoriesByAdmin(req.query);
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
        const result = yield services_1.mainCatService.getMainCategories(req.query);
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
        const result = yield services_1.mainCatService.deleteMainCategory(req.params.categoryId);
        utils_1.helper.buildResponse(res, "Category deleted sucessfully", result);
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
        const result = yield services_1.mainCatService.updateCategoryStatus(req.params.categoryId, req.body.status);
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
    patchUpdateCategoryStatus,
    getMainCategoriesByAdmin,
};
