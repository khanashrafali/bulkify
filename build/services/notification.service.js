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
 * save user's billing/shipping addresses
 */
const saveNotification = (req, data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield models_1.notificationModel.create(Object.assign({}, data));
    }
    catch (error) {
        throw error;
    }
});
/**
 * fetch user's billing/shipping notification
 */
const getNotification = (req, id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const notifiction = yield models_1.notificationModel.findOne({ _id: id });
        return notifiction;
    }
    catch (error) {
        throw error;
    }
});
/**
 * fetch user's billing/shipping addresses
 */
const getNotifications = (req, queryParams) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let userObj = req.user.toJSON();
        let conditions = { createdAt: { $gt: userObj.createdAt } };
        const pageInfo = utils_1.helper.checkPagination(queryParams);
        let mongoQuery = models_1.notificationModel.find(conditions).sort({ updatedAt: -1 });
        const count = yield models_1.notificationModel.countDocuments(conditions);
        let docs = [];
        if (pageInfo)
            docs = yield mongoQuery.skip(pageInfo.skip).limit(pageInfo.pageSize).lean();
        else
            docs = yield mongoQuery.lean();
        docs = docs.map((noti) => {
            if (noti.readingByUsers.find((u) => u.toString() == req.user._id.toString()))
                noti.read = true;
            else
                noti.read = false;
            return noti;
        });
        return utils_1.helper.makePaginatedData(docs, count, pageInfo);
    }
    catch (error) {
        throw error;
    }
});
/**
 * update user's billing/shipping addresses
 */
const updateNotification = (req, id, data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const notifiction = yield models_1.notificationModel.findOne({ _id: id });
        if (!notifiction)
            throw utils_1.helper.buildError("No notification found with this id", 404);
        yield notifiction.set(Object.assign(Object.assign({}, data), { readingByUsers: [] })).save();
    }
    catch (error) {
        throw error;
    }
});
/**
 * delete user's billing/shipping notification
 */
const deleteNotification = (req, id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const notifiction = yield models_1.notificationModel.findOne({ _id: id });
        if (!notifiction)
            throw utils_1.helper.buildError("No notification found with this id", 404);
        return yield notifiction.remove();
    }
    catch (error) {
        throw error;
    }
});
/**
 * delete user's billing/shipping notification
 */
const readNotification = (req, id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const notifiction = yield models_1.notificationModel.findOne({ _id: id });
        if (!notifiction)
            throw utils_1.helper.buildError("No notification found with this id", 404);
        let notiObj = notifiction.toJSON();
        let users = [...notiObj.readingByUsers];
        users.push(req.user._id);
        return yield notifiction.set({ readingByUsers: users }).save();
    }
    catch (error) {
        throw error;
    }
});
exports.default = {
    saveNotification,
    getNotification,
    getNotifications,
    updateNotification,
    deleteNotification,
    readNotification,
};
