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
const addPrice = (body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield models_1.pricesModel.create(body);
    }
    catch (error) {
        throw error;
    }
});
const updatePrice = (priceId, body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield models_1.pricesModel.updateOne({ _id: priceId }, { $set: body });
    }
    catch (error) {
        throw error;
    }
});
const getPrices = (queryParams) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pageInfo = utils_1.helper.checkPagination(queryParams);
        const mongoQuery = models_1.pricesModel.find();
        let docs = [];
        const count = yield models_1.pricesModel.countDocuments();
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
const deletePrice = (priceId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield models_1.pricesModel.deleteOne({ _id: priceId });
    }
    catch (error) {
        throw error;
    }
});
const fetchPrice = (priceId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let price = yield models_1.pricesModel.findOne({ _id: priceId });
        if (!price)
            throw utils_1.helper.buildError("no price found with this id", 404);
        return price;
    }
    catch (error) {
        throw error;
    }
});
const fetchPriceByKey = (key) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let price = yield models_1.pricesModel.findOne({ key });
        if (!price)
            throw utils_1.helper.buildError("no price found with this id", 404);
        return price;
    }
    catch (error) {
        throw error;
    }
});
exports.default = {
    addPrice,
    updatePrice,
    getPrices,
    deletePrice,
    fetchPrice,
    fetchPriceByKey,
};
