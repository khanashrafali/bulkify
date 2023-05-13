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
const addBrand = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield models_1.brandModel.create(data);
    }
    catch (error) {
        throw error;
    }
});
const getBrand = (brandId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const oldBrand = yield models_1.brandModel.findOne({ _id: brandId }).populate({ path: "categories", select: "name image" });
        if (!oldBrand)
            throw utils_1.helper.buildError("No brand found with this id", 404);
        return oldBrand;
    }
    catch (error) {
        throw error;
    }
});
const getBrands = (queryParams) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let conditions = { isApproved: true };
        const pageInfo = utils_1.helper.checkPagination(queryParams);
        if ("isApproved" in queryParams)
            conditions.isApproved = queryParams.isApproved;
        if ("category" in queryParams)
            conditions.categories = queryParams.category;
        let mongoQuery = models_1.brandModel
            .find(conditions)
            .sort({ brandName: 1 })
            .populate({ path: "categories", select: "name image" });
        const count = yield models_1.brandModel.countDocuments(conditions);
        let docs = [];
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
const getBrandsByAdmin = (queryParams) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let conditions = {};
        const pageInfo = utils_1.helper.checkPagination(queryParams);
        if ("isApproved" in queryParams)
            conditions.isApproved = queryParams.isApproved;
        if ("category" in queryParams)
            conditions.categories = queryParams.category;
        let mongoQuery = models_1.brandModel
            .find(conditions)
            .sort({ brandName: 1 })
            .populate({ path: "categories", select: "name image" });
        const count = yield models_1.brandModel.countDocuments(conditions);
        let docs = [];
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
const updateBrand = (brandId, data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const oldBrand = yield models_1.brandModel.findOne({ _id: brandId });
        if (!oldBrand)
            throw utils_1.helper.buildError("No brand found with this id", 404);
        yield oldBrand.set(data).save();
    }
    catch (error) {
        throw error;
    }
});
const deleteBrand = (brandId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const oldBrand = yield models_1.brandModel.findOne({ _id: brandId });
        if (!oldBrand)
            throw utils_1.helper.buildError("No brand found with this id", 404);
        return yield oldBrand.remove();
    }
    catch (error) {
        throw error;
    }
});
const updateStatus = (brandId, isApproved) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let brand = yield models_1.brandModel.findOne({ _id: brandId });
        if (!brand)
            throw utils_1.helper.buildError("No brand found with this id", 404);
        yield brand.set({ isApproved }).save();
    }
    catch (error) {
        throw error;
    }
});
exports.default = {
    addBrand,
    getBrand,
    getBrands,
    updateBrand,
    deleteBrand,
    updateStatus,
    getBrandsByAdmin,
};
