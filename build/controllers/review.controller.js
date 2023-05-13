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
 * add product review
 */
const postAddReview = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        let files = req.files;
        yield services_1.reviewService.addReview(req, files.reviewFiles, req.body);
        utils_1.helper.buildResponse(res, "Review saved successfully", files);
    }
    catch (error) {
        next(error);
    }
});
/**
 * get product reviews
 */
const getProductReviews = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        const result = yield services_1.reviewService.getProductReviews(req.params.productId);
        utils_1.helper.buildResponse(res, "Reviews fetched successfully", result);
    }
    catch (error) {
        next(error);
    }
});
/**
 * remove product review
 */
const deleteReview = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        const result = yield services_1.reviewService.deleteReview(req.params.reviewId);
        utils_1.helper.buildResponse(res, "Review deleted successfully", result);
    }
    catch (error) {
        next(error);
    }
});
/**
 * get review by product id
 */
const getProductReview = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        const result = yield services_1.reviewService.getUserProductReview(req, req.query);
        utils_1.helper.buildResponse(res, "Review fetched successfully", result);
    }
    catch (error) {
        next(error);
    }
});
const setAdminRating = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        yield services_1.reviewService.setAdminRating(req.params.productId, req.body);
        utils_1.helper.buildResponse(res, "Product rating updated.");
    }
    catch (error) {
        next(error);
    }
});
exports.default = {
    postAddReview,
    getProductReviews,
    deleteReview,
    getProductReview,
    setAdminRating,
};
