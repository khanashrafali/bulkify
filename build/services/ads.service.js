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
const addAds = (data, file) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield models_1.adsModel.create(Object.assign(Object.assign({}, data), { file: {
                xlg: file.xlg.Location,
                lg: file.lg.Location,
                md: file.md.Location,
                sm: file.sm.Location,
                xs: file.xs.Location,
                original: file.original.Location,
            } }));
    }
    catch (error) {
        throw error;
    }
});
const getAds = (adsId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const oldBrand = yield models_1.adsModel.findOne({ _id: adsId }).populate({
            path: "product",
            select: "name images",
        });
        if (!oldBrand)
            throw utils_1.helper.buildError("No ads found with this id", 404);
        return oldBrand;
    }
    catch (error) {
        throw error;
    }
});
const getAdss = (queryParams) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let conditions = {};
        const pageInfo = utils_1.helper.checkPagination(queryParams);
        if ("location" in queryParams)
            conditions.location = queryParams.location;
        let mongoQuery = models_1.adsModel.find(conditions).sort({ createdAt: -1 }).populate({
            path: "product",
            select: "name images",
        });
        const count = yield models_1.adsModel.countDocuments(conditions);
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
const updateAds = (adsId, data, file) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const oldBrand = yield models_1.adsModel.findOne({ _id: adsId });
        if (!oldBrand)
            throw utils_1.helper.buildError("No ads found with this id", 404);
        if (file) {
            data.file = {
                xlg: file.xlg.Location,
                lg: file.lg.Location,
                md: file.md.Location,
                sm: file.sm.Location,
                xs: file.xs.Location,
                original: file.original.Location,
            };
        }
        else
            delete data.file;
        yield oldBrand.set(data).save();
    }
    catch (error) {
        throw error;
    }
});
const deleteAds = (adsId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const oldBrand = yield models_1.adsModel.findOne({ _id: adsId });
        if (!oldBrand)
            throw utils_1.helper.buildError("No ads found with this id", 404);
        return yield oldBrand.remove();
    }
    catch (error) {
        throw error;
    }
});
exports.default = {
    addAds,
    getAds,
    getAdss,
    updateAds,
    deleteAds,
};
