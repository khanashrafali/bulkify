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
const saveQueiry = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield models_1.queriesModel.create(data);
        yield utils_1.emailHandler.sentMail("mmanihar.in@gmail.com", `${data.name}`, `
       <p> ${data.message} </p>

        Thanks & Regards
        ${data.name}
        ${data.email}
    `);
    }
    catch (error) {
        throw error;
    }
});
const getQueries = (queryParams) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pageInfo = utils_1.helper.checkPagination(queryParams);
        const mongoQuery = models_1.queriesModel.find();
        let docs = [];
        const count = yield models_1.queriesModel.countDocuments();
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
const getQuery = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield models_1.queriesModel.findOne({ _id: id });
        if (!data)
            throw utils_1.helper.buildError("no data found with this id", 404);
        return data;
    }
    catch (error) {
        throw error;
    }
});
exports.default = {
    saveQueiry,
    getQueries,
    getQuery,
};
