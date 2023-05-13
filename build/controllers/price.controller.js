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
const express_validator_1 = require("express-validator");
const services_1 = require("../services");
const utils_1 = require("../utils");
const addPrice = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        let result = yield services_1.priceService.addPrice((0, express_validator_1.matchedData)(req));
        utils_1.helper.buildResponse(res, "Price Added Successfully.", result);
    }
    catch (error) {
        next(error);
    }
});
const updatePrice = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        let result = yield services_1.priceService.updatePrice(req.params.priceId, (0, express_validator_1.matchedData)(req));
        utils_1.helper.buildResponse(res, "Price Updated Successfully.", result);
    }
    catch (error) {
        next(error);
    }
});
const getPrices = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        let result = yield services_1.priceService.getPrices(req.query.categoryId);
        utils_1.helper.buildResponse(res, "Fetched Prices Successfully.", result);
    }
    catch (error) {
        next(error);
    }
});
const deletePrice = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        let result = yield services_1.priceService.deletePrice(req.params.priceId);
        utils_1.helper.buildResponse(res, "Price Deleted Successfully.", result);
    }
    catch (error) {
        next(error);
    }
});
const fetchPrice = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        let result = yield services_1.priceService.fetchPrice(req.params.priceId);
        utils_1.helper.buildResponse(res, "Price Fetched Successfully.", result);
    }
    catch (error) {
        next(error);
    }
});
const fetchPriceByKey = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        let result = yield services_1.priceService.fetchPriceByKey(req.params.key);
        utils_1.helper.buildResponse(res, "Price Fetched Successfully.", result);
    }
    catch (error) {
        next(error);
    }
});
exports.default = {
    addPrice,
    updatePrice,
    getPrices,
    fetchPrice,
    fetchPriceByKey,
    deletePrice,
};
