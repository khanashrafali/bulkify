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
 * get app users api
 */
const getAppUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        let result = yield services_1.userService.getUsers(req.query);
        utils_1.helper.buildResponse(res, "Users fetched sucessfully", result);
    }
    catch (error) {
        next(error);
    }
});
const adminDashboradInfo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        let result = yield services_1.userService.adminDashboradInfo(req);
        utils_1.helper.buildResponse(res, "Dashboard Info fetched sucessfully", result);
    }
    catch (error) {
        next(error);
    }
});
const vendorDashboradInfo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        let result = yield services_1.userService.vendorDashboradInfo(req);
        utils_1.helper.buildResponse(res, "Dashboard Info fetched sucessfully", result);
    }
    catch (error) {
        next(error);
    }
});
/**
 * subscribe user
 */
const postSubscribe = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        yield services_1.userService.subscribe(req.body.email, res);
        utils_1.helper.buildResponse(res, "subscribe successfully.");
    }
    catch (error) {
        next(error);
    }
});
/**
 * subscribe user
 */
const updateStatus = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        yield services_1.userService.updateStatus(req.params.userId, req.body.status);
        utils_1.helper.buildResponse(res, "Status updated Successfully.");
    }
    catch (error) {
        next(error);
    }
});
/**
 * get app home page
 */
const getAppHomePage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        let result = yield services_1.userService.getAppHomePage(req.query);
        utils_1.helper.buildResponse(res, "Fetched info.", result);
    }
    catch (error) {
        next(error);
    }
});
const updateProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        let result = yield services_1.userService.updateProfile(req, (0, express_validator_1.matchedData)(req));
        utils_1.helper.buildResponse(res, "Profile Updated.", result);
    }
    catch (error) {
        next(error);
    }
});
const deleteMe = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        let result = yield services_1.userService.deleteMe(req);
        utils_1.helper.buildResponse(res, "Account Removed Successfully", result);
    }
    catch (error) {
        next(error);
    }
});
const postUserFeedback = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        utils_1.helper.handlePayloadError(req);
        let result = yield services_1.userService.saveUserFeedback(req.body);
        utils_1.helper.buildResponse(res, "Feedback Saved Successfully.", result);
        if ((_a = req.body.email) === null || _a === void 0 ? void 0 : _a.length)
            yield utils_1.emailHandler.sentQueryEmail(req.body.email, req.body.name);
    }
    catch (error) {
        next(error);
    }
});
const getFeedBacks = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        let result = yield services_1.userService.getFeedBacks(req.query);
        utils_1.helper.buildResponse(res, "Feedback Fetched Successfully.", result);
    }
    catch (error) {
        next(error);
    }
});
exports.default = {
    getAppUsers,
    adminDashboradInfo,
    vendorDashboradInfo,
    postSubscribe,
    updateStatus,
    deleteMe,
    getAppHomePage,
    updateProfile,
    postUserFeedback,
    getFeedBacks,
};
