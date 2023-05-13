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
 * get user addresses api
 */
const getAddresses = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let result = yield services_1.addressService.getAddresses(req);
        utils_1.helper.buildResponse(res, "Addresses fetched Successfully", { addressList: result });
    }
    catch (error) {
        next(error);
    }
});
/**
 * get user address api
 */
const getAddress = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let result = yield services_1.addressService.getAddress(req, req.params.addressId);
        utils_1.helper.buildResponse(res, "Address fetched Successfully", result);
    }
    catch (error) {
        next(error);
    }
});
/**
 * post save user address api
 */
const postSaveAddress = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        let result = yield services_1.addressService.saveAddress(req, req.body);
        utils_1.helper.buildResponse(res, "Address saved successfully", result);
    }
    catch (error) {
        next(error);
    }
});
/**
 * post save user address api
 */
const putUpdateAddress = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        let result = yield services_1.addressService.updateAddress(req, req.params.addressId, (0, express_validator_1.matchedData)(req));
        utils_1.helper.buildResponse(res, "Address updated Successfully", result);
    }
    catch (error) {
        next(error);
    }
});
/**
 * delete user address api
 */
const deleteAddress = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let result = yield services_1.addressService.deleteAddress(req, req.params.addressId);
        utils_1.helper.buildResponse(res, "Address deleted successfully", result);
    }
    catch (error) {
        next(error);
    }
});
/**
 * make default user address api
 */
const putSetDefaultAddress = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let result = yield services_1.addressService.makeDefaultAddress(req, req.params.addressId);
        utils_1.helper.buildResponse(res, "Address make dafault successfully", result);
    }
    catch (error) {
        next(error);
    }
});
exports.default = {
    getAddress,
    postSaveAddress,
    getAddresses,
    putUpdateAddress,
    deleteAddress,
    putSetDefaultAddress,
};
