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
 * create coupon api
 */
const postAddCoupon = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        yield services_1.couponService.addCoupon(req, (0, express_validator_1.matchedData)(req));
        utils_1.helper.buildResponse(res, "Coupon added sucessfully");
    }
    catch (error) {
        next(error);
    }
});
/**
 * update coupon api
 */
const putUpdateCoupon = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        yield services_1.couponService.updateCoupon(req.params.couponId, (0, express_validator_1.matchedData)(req));
        utils_1.helper.buildResponse(res, "Coupon updated sucessfully");
    }
    catch (error) {
        next(error);
    }
});
/**
 * update coupon status api
 */
const patchUpdateCouponStatus = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        yield services_1.couponService.updateCouponStatus(req.params.couponId, req.body.isPrivate);
        utils_1.helper.buildResponse(res, "Coupon status updated sucessfully");
    }
    catch (error) {
        next(error);
    }
});
/**
 * delete coupon api
 */
const deleteCoupon = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        yield services_1.couponService.deleteCoupon(req.params.couponId);
        utils_1.helper.buildResponse(res, "Coupon deleted sucessfully");
    }
    catch (error) {
        next(error);
    }
});
/**
 * get single coupon api
 */
const getCoupon = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        let result = yield services_1.couponService.getCoupon(req.params.couponId);
        utils_1.helper.buildResponse(res, "Coupon fetched sucessfully", result);
    }
    catch (error) {
        next(error);
    }
});
/**
 * get coupons api
 */
const getCoupons = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        let result = yield services_1.couponService.getCoupons(req.query);
        utils_1.helper.buildResponse(res, "Coupons fetched sucessfully", result);
    }
    catch (error) {
        next(error);
    }
});
/**
 * apply coupon api
 */
const postApplyCoupon = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        let result = yield services_1.couponService.postApplyCoupon(req.body.code);
        utils_1.helper.buildResponse(res, "Coupon fetched successfully", result);
    }
    catch (error) {
        next(error);
    }
});
/**
 * get coupons by users api
 */
const getCouponByUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        let result = yield services_1.couponService.getCouponsByUsers(req.query);
        utils_1.helper.buildResponse(res, "Coupons fetched sucessfully", result);
    }
    catch (error) {
        next(error);
    }
});
exports.default = {
    postAddCoupon,
    putUpdateCoupon,
    patchUpdateCouponStatus,
    deleteCoupon,
    getCoupon,
    getCoupons,
    postApplyCoupon,
    getCouponByUsers,
};
