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
// create payout
const postCreatePayout = (req, body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        for (let payout of body.payouts) {
            yield models_1.orderModel.updateOne({ _id: payout.order }, { $set: { payoutCompelete: true } });
        }
        return yield models_1.payoutModel.insertMany(body.payouts);
    }
    catch (error) {
        throw error;
    }
});
// fetch payout
const getPayout = (payoutId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield models_1.payoutModel
            .findById(payoutId)
            .populate({ path: "order", populate: { path: "product" } })
            .populate({ path: "vendor", select: "name" });
    }
    catch (error) {
        throw error;
    }
});
// fetch payouts
const getPayouts = (queryParams) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let conditions = {};
        const pageInfo = utils_1.helper.checkPagination(queryParams);
        if ("createdAt" in queryParams)
            conditions.date = queryParams.createdAt;
        let docs = [];
        let count = yield models_1.payoutModel.countDocuments(conditions);
        let mongoQuery = models_1.payoutModel
            .find(conditions)
            .populate({ path: "order", populate: { path: "product" } })
            .populate({ path: "vendor", select: "name" });
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
    postCreatePayout,
    getPayout,
    getPayouts,
};
