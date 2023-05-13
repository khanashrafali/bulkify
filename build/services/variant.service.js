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
const populate = (query) => query.populate("categories");
const addVariant = (body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield models_1.variantModel.create(body);
    }
    catch (error) {
        throw error;
    }
});
const updateVariant = (vid, body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let variant = yield populate(models_1.variantModel.findOne({ _id: vid }));
        if (!variant)
            throw utils_1.helper.buildError("no variant found with this id", 404);
        return yield variant.set(body).save();
    }
    catch (error) {
        throw error;
    }
});
const updateVariantStatus = (vid, status) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let variant = yield models_1.variantModel.findOne({ _id: vid });
        if (!variant)
            throw utils_1.helper.buildError("no variant found with this id", 404);
        return yield variant.set({ status }).save();
    }
    catch (error) {
        throw error;
    }
});
const getVariant = (vid) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let variant = yield populate(models_1.variantModel.findOne({ _id: vid }));
        if (!variant)
            throw utils_1.helper.buildError("no variant found with this id", 404);
        return variant;
    }
    catch (error) {
        throw error;
    }
});
const getVariants = (queryParams) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let pageInfo = utils_1.helper.checkPagination(queryParams);
        let conditions = { values: { $ne: [] } };
        if ("status" in queryParams)
            conditions.status = queryParams.status;
        if ("category" in queryParams)
            conditions.categories = queryParams.category;
        let count = yield models_1.variantModel.countDocuments(conditions);
        let docs = [];
        let mongoQuery = populate(models_1.variantModel.find(conditions));
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
const deleteVariant = (vid) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let variant = yield populate(models_1.variantModel.findOne({ _id: vid }));
        if (!variant)
            throw utils_1.helper.buildError("no variant found with this id", 404);
        return yield variant.delete();
    }
    catch (error) {
        throw error;
    }
});
const getVariantByAdmin = (vid) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let variant = yield populate(models_1.variantModel.findOne({ _id: vid }));
        if (!variant)
            throw utils_1.helper.buildError("no variant found with this id", 404);
        return variant;
    }
    catch (error) {
        throw error;
    }
});
const getVariantsByAdmin = (queryParams) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let pageInfo = utils_1.helper.checkPagination(queryParams);
        let conditions = { values: { $ne: [] } };
        if ("status" in queryParams)
            conditions.status = queryParams.status;
        if ("category" in queryParams)
            conditions.categories = queryParams.category;
        let count = yield models_1.variantModel.countDocuments(conditions);
        let docs = [];
        let mongoQuery = populate(models_1.variantModel.find(conditions));
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
exports.default = {
    addVariant,
    updateVariant,
    getVariant,
    getVariants,
    deleteVariant,
    updateVariantStatus,
    getVariantByAdmin,
    getVariantsByAdmin,
};
