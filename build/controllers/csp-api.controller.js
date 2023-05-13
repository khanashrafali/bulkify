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
const cspLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let result = yield services_1.erpApiService.cspLogin();
        return utils_1.helper.buildResponse(res, "success", result);
    }
    catch (error) {
        next(error);
    }
});
const cspItemList = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let result = yield services_1.erpApiService.cspItemList();
        return utils_1.helper.buildResponse(res, "success", result);
    }
    catch (error) {
        next(error);
    }
});
const postOnlineOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let result = yield services_1.erpApiService.postOnlineOrder();
        return utils_1.helper.buildResponse(res, "success", result);
    }
    catch (error) {
        next(error);
    }
});
const monitorOnlineOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let result = yield services_1.erpApiService.monitorOnlineOrder();
        return utils_1.helper.buildResponse(res, "success", result);
    }
    catch (error) {
        next(error);
    }
});
const saveErpDataIntoMarketPlace = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.buildResponse(res, "Pulling Started....");
        let result = yield services_1.erpApiService.saveErpDataIntoMarketPlace();
    }
    catch (error) {
        next(error);
    }
});
exports.default = {
    cspLogin,
    cspItemList,
    postOnlineOrder,
    monitorOnlineOrder,
    saveErpDataIntoMarketPlace,
};
