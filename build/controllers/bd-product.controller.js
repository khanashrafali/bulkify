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
const addBDProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        utils_1.helper.handlePayloadError(req);
        let result = yield services_1.bdProductService.addBDProduct(req, req.body.product, req.body.variant, req.body.comment, (_a = req.file) === null || _a === void 0 ? void 0 : _a.Location);
        utils_1.helper.buildResponse(res, "Item added To BadalDalo Product", result);
    }
    catch (error) {
        next(error);
    }
});
const deleteDBProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        yield services_1.bdProductService.deleteDBProduct(req.user._id.toString(), req.params.productId, req.params.variantId);
        utils_1.helper.buildResponse(res, "Item deleted from BadalDalo Product");
    }
    catch (error) {
        next(error);
    }
});
const getBDProducts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        let result = yield services_1.bdProductService.getBDProducts(req.user._id);
        utils_1.helper.buildResponse(res, "BadalDalo Product fetched successfully", result);
    }
    catch (error) {
        next(error);
    }
});
const clearBDProducts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        yield services_1.bdProductService.clearBDProducts(req.user._id);
        utils_1.helper.buildResponse(res, "BadalDalo Product cleared successully");
    }
    catch (error) {
        next(error);
    }
});
exports.default = {
    addBDProduct,
    deleteDBProduct,
    getBDProducts,
    clearBDProducts,
};
