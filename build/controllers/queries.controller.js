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
 * add item to cart api
 */
const saveQueiry = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        let result = yield services_1.queriesService.saveQueiry(req.body);
        utils_1.helper.buildResponse(res, "Query saved successfully", result);
    }
    catch (error) {
        next(error);
    }
});
const getQueries = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        let result = yield services_1.queriesService.getQueries(req.query);
        utils_1.helper.buildResponse(res, "Query fetched Successfully.", result);
    }
    catch (error) {
        next(error);
    }
});
const getQuery = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        let result = yield services_1.queriesService.getQuery(req.params.id);
        utils_1.helper.buildResponse(res, "Query fetched Successfully.", result);
    }
    catch (error) {
        next(error);
    }
});
exports.default = {
    saveQueiry,
    getQueries,
    getQuery,
};
