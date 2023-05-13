"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../../controllers");
const isAdminAuth_1 = require("../middlewares/isAdminAuth");
const validator_1 = __importDefault(require("./validator"));
const router = (0, express_1.Router)();
router.post("/update/config", isAdminAuth_1.isAdmin, controllers_1.adminCtrl.saveConfigInfo);
router.get("/config", isAdminAuth_1.isAdmin, controllers_1.adminCtrl.getConfigInfo);
router.get("/", isAdminAuth_1.isAdmin, validator_1.default.getUsers, controllers_1.adminCtrl.getAdminUsers);
router.post("/", isAdminAuth_1.isAdmin, validator_1.default.postAddAdmin, controllers_1.adminCtrl.postAddAdmin);
router.patch("/isActive/:adminId", isAdminAuth_1.isAdmin, validator_1.default.patchUpdateAdminActiveStatus, controllers_1.adminCtrl.patchUpdateAdminActiveStatus);
router.delete("/:adminId", isAdminAuth_1.isAdmin, controllers_1.adminCtrl.deleteAdmin);
exports.default = router;
