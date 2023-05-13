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
const getBrands = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let result = yield services_1.brandService.getBrands(req.query);
        utils_1.helper.buildResponse(res, "Brands fetched Successfully", result);
    }
    catch (error) {
        next(error);
    }
});
const getBrandsByAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let result = yield services_1.brandService.getBrandsByAdmin(req.query);
        utils_1.helper.buildResponse(res, "Brands fetched Successfully", result);
    }
    catch (error) {
        next(error);
    }
});
const getBrand = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        let result = yield services_1.brandService.getBrand(req.params.brandId);
        utils_1.helper.buildResponse(res, "Brand fetched Successfully", result);
    }
    catch (error) {
        next(error);
    }
});
const addBrand = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        let result = yield services_1.brandService.addBrand((0, express_validator_1.matchedData)(req));
        utils_1.helper.buildResponse(res, "Brand saved successfully", result);
    }
    catch (error) {
        next(error);
    }
});
const updateBrand = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        let result = yield services_1.brandService.updateBrand(req.params.brandId, (0, express_validator_1.matchedData)(req));
        utils_1.helper.buildResponse(res, "Brand updated Successfully", result);
    }
    catch (error) {
        next(error);
    }
});
const deleteBrand = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let result = yield services_1.brandService.deleteBrand(req.params.brandId);
        utils_1.helper.buildResponse(res, "Brand deleted successfully", result);
    }
    catch (error) {
        next(error);
    }
});
const updateStatus = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let result = yield services_1.brandService.updateStatus(req.params.brandId, req.body.isApproved);
        utils_1.helper.buildResponse(res, "Brand status updated successfully", result);
    }
    catch (error) {
        next(error);
    }
});
exports.default = {
    getBrands,
    getBrand,
    addBrand,
    updateBrand,
    deleteBrand,
    updateStatus,
    getBrandsByAdmin,
};
