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
const addVariant = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        let result = yield services_1.variantService.addVariant(req.body);
        return utils_1.helper.buildResponse(res, "Variant Added", result);
    }
    catch (error) {
        next(error);
    }
});
const updateVariant = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        let result = yield services_1.variantService.updateVariant(req.params.variantId, req.body);
        return utils_1.helper.buildResponse(res, "Variant Updated", result);
    }
    catch (error) {
        next(error);
    }
});
const updateVariantStatus = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        let result = yield services_1.variantService.updateVariantStatus(req.params.variantId, req.body.status);
        return utils_1.helper.buildResponse(res, "Variant Status Updated", result);
    }
    catch (error) {
        next(error);
    }
});
const getVariant = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        let result = yield services_1.variantService.getVariant(req.params.variantId);
        return utils_1.helper.buildResponse(res, "Fetched Variant", result);
    }
    catch (error) {
        next(error);
    }
});
const getVariants = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        let result = yield services_1.variantService.getVariants(req.query);
        return utils_1.helper.buildResponse(res, "Fetched Variants", result);
    }
    catch (error) {
        next(error);
    }
});
const getVariantByAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        let result = yield services_1.variantService.getVariantByAdmin(req.params.variantId);
        return utils_1.helper.buildResponse(res, "Fetched Variant", result);
    }
    catch (error) {
        next(error);
    }
});
const getVariantsByAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        let result = yield services_1.variantService.getVariantsByAdmin(req.query);
        return utils_1.helper.buildResponse(res, "Fetched Variants", result);
    }
    catch (error) {
        next(error);
    }
});
const deleteVariant = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        let result = yield services_1.variantService.deleteVariant(req.params.variantId);
        return utils_1.helper.buildResponse(res, "Variant Deleted", result);
    }
    catch (error) {
        next(error);
    }
});
exports.default = {
    addVariant,
    updateVariant,
    getVariant,
    getVariants,
    deleteVariant,
    getVariantByAdmin,
    getVariantsByAdmin,
    updateVariantStatus,
};
