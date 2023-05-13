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
router.post("/", isAdminAuth_1.isAdmin, validator_1.default.addContent, controllers_1.contentCtrl.addContent);
router.put("/:contentIdOrSlug", isAdminAuth_1.isAdmin, validator_1.default.updateContent, controllers_1.contentCtrl.updateContent);
router.delete("/:contentIdOrSlug", isAdminAuth_1.isAdmin, validator_1.default.deleteContent, controllers_1.contentCtrl.deleteContent);
router.get("/:contentIdOrSlug", validator_1.default.getContent, controllers_1.contentCtrl.getContent);
router.get("", validator_1.default.getContents, controllers_1.contentCtrl.getContents);
exports.default = router;
