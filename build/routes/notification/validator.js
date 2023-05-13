"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const saveNotification = [(0, express_validator_1.body)("msg", "Please enter valid msg").exists().trim().notEmpty()];
const getNotification = [(0, express_validator_1.param)("id", "Please enter valid id").exists().trim().isMongoId()];
const getNotifications = [];
const updateNotification = [...getNotification, ...saveNotification];
const deleteNotification = [...getNotification];
exports.default = {
    saveNotification,
    getNotifications,
    updateNotification,
    getNotification,
    deleteNotification,
};
