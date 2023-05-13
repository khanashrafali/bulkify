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
const addDeleveryAddress = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let result = yield services_1.deleveryService.addDeleveryAddress(req.body);
        return utils_1.helper.buildResponse(res, "Location Added", result);
    }
    catch (error) {
        next(error);
    }
});
const updateDeleveryAddress = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let result = yield services_1.deleveryService.updateDeleveryAddress(req.params.id, req.body);
        return utils_1.helper.buildResponse(res, "Location Updated", result);
    }
    catch (error) {
        next(error);
    }
});
const getDeleveryAddress = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let result = yield services_1.deleveryService.getDeleveryAddress(req.params.id);
        return utils_1.helper.buildResponse(res, "Fetched Location", result);
    }
    catch (error) {
        next(error);
    }
});
const getDeleveryAddresses = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let result = yield services_1.deleveryService.getDeleveryAddresses(req.query);
        return utils_1.helper.buildResponse(res, "Fetched Addresses", result);
    }
    catch (error) {
        next(error);
    }
});
const deleteDeleveryAddress = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let result = yield services_1.deleveryService.deleteDeleveryAddress(req.params.id);
        return utils_1.helper.buildResponse(res, "Location Deleted", result);
    }
    catch (error) {
        next(error);
    }
});
const uploadAddress = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let result = yield services_1.deleveryService.uploadAddress(req.body.locations);
        return utils_1.helper.buildResponse(res, "Locations Added", result);
    }
    catch (error) {
        next(error);
    }
});
exports.default = {
    addDeleveryAddress,
    updateDeleveryAddress,
    getDeleveryAddress,
    getDeleveryAddresses,
    deleteDeleveryAddress,
    uploadAddress,
};
