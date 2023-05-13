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
/**
 * get user banks api
 */
const getBanks = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let result = yield services_1.bankService.getBanks(req);
        utils_1.helper.buildResponse(res, "Banks fetched Successfully", result);
    }
    catch (error) {
        next(error);
    }
});
/**
 * get user bank api
 */
const getBank = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let result = yield services_1.bankService.getBank(req, req.params.bankId);
        utils_1.helper.buildResponse(res, "Bank fetched Successfully", result);
    }
    catch (error) {
        next(error);
    }
});
/**
 * post save user bank api
 */
const saveBank = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        let result = yield services_1.bankService.addBank(req, (0, express_validator_1.matchedData)(req));
        utils_1.helper.buildResponse(res, "Bank saved successfully", result);
    }
    catch (error) {
        next(error);
    }
});
/**
 * post save user bank api
 */
const updateBank = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        let result = yield services_1.bankService.updateBank(req, req.params.bankId, (0, express_validator_1.matchedData)(req));
        utils_1.helper.buildResponse(res, "Bank updated Successfully", result);
    }
    catch (error) {
        next(error);
    }
});
/**
 * delete user bank api
 */
const deleteBank = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let result = yield services_1.bankService.deleteBank(req, req.params.bankId);
        utils_1.helper.buildResponse(res, "Bank deleted successfully", result);
    }
    catch (error) {
        next(error);
    }
});
/**
 * make default user bank api
 */
const putSetDefaultBank = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let result = yield services_1.bankService.makeDefaultBank(req, req.params.bankId);
        utils_1.helper.buildResponse(res, "Bank make dafault successfully", result);
    }
    catch (error) {
        next(error);
    }
});
exports.default = {
    getBanks,
    getBank,
    saveBank,
    updateBank,
    deleteBank,
    putSetDefaultBank,
};
