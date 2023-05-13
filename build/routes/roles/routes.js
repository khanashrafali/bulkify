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
router.post("", isAdminAuth_1.isAdmin, validator_1.default.addRole, controllers_1.roleController.addRole);
router.put("/:roleId", isAdminAuth_1.isAdmin, validator_1.default.updateRole, controllers_1.roleController.updateRole);
router.get("/:roleId", validator_1.default.getRole, controllers_1.roleController.getRole);
router.delete("/:roleId", isAdminAuth_1.isAdmin, validator_1.default.deleteRole, controllers_1.roleController.deleteRole);
router.get("", validator_1.default.getRoles, controllers_1.roleController.getRoles);
exports.default = router;
