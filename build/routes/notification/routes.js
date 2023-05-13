"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../../controllers");
const isAdminAuth_1 = require("../middlewares/isAdminAuth");
const isUserAuth_1 = require("../middlewares/isUserAuth");
const validator_1 = __importDefault(require("./validator"));
const router = (0, express_1.Router)();
router.post("", isAdminAuth_1.isAdmin, validator_1.default.saveNotification, controllers_1.notificationController.saveNotification);
router.get("", isUserAuth_1.isUser, validator_1.default.getNotifications, controllers_1.notificationController.getNotifications);
router.get("/admin", isAdminAuth_1.isAdmin, validator_1.default.getNotifications, controllers_1.notificationController.getNotifications);
router.put("/:id", isAdminAuth_1.isAdmin, validator_1.default.updateNotification, controllers_1.notificationController.updateNotification);
router.get("/:id", isUserAuth_1.isUser, validator_1.default.getNotification, controllers_1.notificationController.getNotification);
router.patch("/:id", isUserAuth_1.isUser, validator_1.default.getNotification, controllers_1.notificationController.readNotification);
router.delete("/:id", isAdminAuth_1.isAdmin, validator_1.default.deleteNotification, controllers_1.notificationController.deleteNotification);
exports.default = router;
