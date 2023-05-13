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
const models_1 = require("../models");
const utils_1 = require("../utils");
utils_1.helper.loadEnvFile();
/**
 * get coupon by id handler
 */
const _fetchCoupon = (couponId) => __awaiter(void 0, void 0, void 0, function* () {
    let coupon = yield models_1.couponModel.findOne({ _id: couponId });
    if (!coupon)
        throw utils_1.helper.buildError("No coupon found with this id", 404);
    return coupon;
});
/**
 * create coupon handler
 */
const addCoupon = (req, data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield models_1.couponModel.create(Object.assign(Object.assign({}, data), { createBy: req.user._id }));
    }
    catch (error) {
        throw error;
    }
});
/**
 * update coupon handler
 */
const updateCoupon = (couponId, data) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        yield ((_a = (yield _fetchCoupon(couponId))) === null || _a === void 0 ? void 0 : _a.set(data).save());
    }
    catch (error) {
        throw error;
    }
});
/**
 * update coupon status handler
 */
const updateCouponStatus = (couponId, isPrivate) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (yield _fetchCoupon(couponId)).set({ isPrivate }).save();
    }
    catch (error) {
        throw error;
    }
});
/**
 * delete coupon handler
 */
const deleteCoupon = (couponId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (yield _fetchCoupon(couponId)).delete();
    }
    catch (error) {
        throw error;
    }
});
/**
 * get coupon by id handler
 */
const getCoupon = (couponId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield _fetchCoupon(couponId);
    }
    catch (error) {
        throw error;
    }
});
/**
 * get coupon list handler
 */
const getCoupons = (queryParams) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        let condition = {};
        const pageInfo = utils_1.helper.checkPagination(queryParams);
        if ((_b = queryParams.textSearch) === null || _b === void 0 ? void 0 : _b.length)
            condition.code = { $regex: utils_1.helper.regxEscape(queryParams.textSearch), $options: "i" };
        if ("status" in queryParams)
            condition.isPrivate = queryParams.status;
        if ("createdAt" in queryParams)
            condition.date = queryParams.createdAt;
        if ("endDate" in queryParams)
            condition.endDate = queryParams.endDate;
        if ("startDate" in queryParams)
            condition.startDate = queryParams.startDate;
        if ("discountInPercent" in queryParams)
            condition.discountInPercent = queryParams.discountInPercent;
        if ("numberOfUsers" in queryParams)
            condition.numberOfUsers = queryParams.numberOfUsers;
        const count = yield models_1.couponModel.countDocuments(condition);
        const mongoQuery = models_1.couponModel.find(condition).sort({ createdAt: -1 });
        let docs = [];
        if (pageInfo)
            docs = yield mongoQuery.skip(pageInfo.skip).limit(pageInfo.pageSize);
        else
            docs = yield mongoQuery;
        return utils_1.helper.makePaginatedData(docs, count, pageInfo);
    }
    catch (error) {
        throw error;
    }
});
/**
 * get coupon list for users handler
 */
const getCouponsByUsers = (queryParams) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    try {
        let condition = { isPrivate: false };
        const pageInfo = utils_1.helper.checkPagination(queryParams);
        if ((_c = queryParams.textSearch) === null || _c === void 0 ? void 0 : _c.length)
            condition.code = { $regex: utils_1.helper.regxEscape(queryParams.textSearch), $options: "i" };
        if ("createdAt" in queryParams)
            condition.date = queryParams.createdAt;
        if ("endDate" in queryParams)
            condition.endDate = queryParams.endDate;
        if ("startDate" in queryParams)
            condition.startDate = queryParams.startDate;
        if ("discountInPercent" in queryParams)
            condition.discountInPercent = queryParams.discountInPercent;
        if ("numberOfUsers" in queryParams)
            condition.numberOfUsers = queryParams.numberOfUsers;
        const count = yield models_1.couponModel.countDocuments(condition);
        const mongoQuery = models_1.couponModel.find(condition).sort({ createdAt: -1 });
        let docs = [];
        if (pageInfo)
            docs = yield mongoQuery.skip(pageInfo.skip).limit(pageInfo.pageSize);
        else
            docs = yield mongoQuery;
        return utils_1.helper.makePaginatedData(docs, count, pageInfo);
    }
    catch (error) {
        throw error;
    }
});
/**
 * get coupon by code handler
 */
const postApplyCoupon = (code) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let now = utils_1.helper.currentDate;
        let condition = { code, isPrivate: false, startDate: { $lte: now }, endDate: { $gte: now } };
        const coupon = yield models_1.couponModel.findOne(condition);
        if (!coupon)
            throw utils_1.helper.buildError("No valid coupon found with this code", 404);
        const couponToJson = coupon.toJSON();
        if (couponToJson.appliedCount >= couponToJson.numberOfUsers)
            throw utils_1.helper.buildError("Coupon expired", 400);
        return couponToJson;
    }
    catch (error) {
        throw error;
    }
});
exports.default = {
    addCoupon,
    updateCoupon,
    deleteCoupon,
    getCoupon,
    updateCouponStatus,
    getCoupons,
    postApplyCoupon,
    getCouponsByUsers,
};
