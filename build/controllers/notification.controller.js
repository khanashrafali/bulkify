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
const getNotifications = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let result = yield services_1.notificationService.getNotifications(req, req.query);
        utils_1.helper.buildResponse(res, "Notifications fetched Successfully", result);
    }
    catch (error) {
        next(error);
    }
});
/**
 * get user address api
 */
const getNotification = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let result = yield services_1.notificationService.getNotification(req, req.params.id);
        utils_1.helper.buildResponse(res, "Notification fetched Successfully", result);
    }
    catch (error) {
        next(error);
    }
});
/**
 * post save user address api
 */
const saveNotification = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        let result = yield services_1.notificationService.saveNotification(req, (0, express_validator_1.matchedData)(req));
        utils_1.helper.buildResponse(res, "Notification saved successfully", result);
    }
    catch (error) {
        next(error);
    }
});
/**
 * post save user address api
 */
const updateNotification = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        let result = yield services_1.notificationService.updateNotification(req, req.params.id, (0, express_validator_1.matchedData)(req));
        utils_1.helper.buildResponse(res, "Notification updated Successfully", result);
    }
    catch (error) {
        next(error);
    }
});
/**
 * delete user address api
 */
const deleteNotification = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let result = yield services_1.notificationService.deleteNotification(req, req.params.id);
        utils_1.helper.buildResponse(res, "Notification deleted successfully", result);
    }
    catch (error) {
        next(error);
    }
});
const readNotification = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let result = yield services_1.notificationService.readNotification(req, req.params.id);
        utils_1.helper.buildResponse(res, "Notification status updated", result);
    }
    catch (error) {
        next(error);
    }
});
exports.default = {
    getNotifications,
    getNotification,
    saveNotification,
    updateNotification,
    deleteNotification,
    readNotification,
};
