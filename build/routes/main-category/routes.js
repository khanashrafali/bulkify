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
router.post("", isAdminAuth_1.isAdmin, validator_1.default.postCreateMainCategory, controllers_1.mainCatController.postCreateMainCategory);
router.get("", validator_1.default.getMainCategories, controllers_1.mainCatController.getMainCategories);
router.get("/by-admin", isAdminAuth_1.isAdmin, validator_1.default.getMainCategories, controllers_1.mainCatController.getMainCategoriesByAdmin);
router.patch("/:categoryId", isAdminAuth_1.isAdmin, validator_1.default.patchUpdateCategoryStatus, controllers_1.mainCatController.patchUpdateCategoryStatus);
router.put("/:categoryId", isAdminAuth_1.isAdmin, validator_1.default.putUpdateMainCategory, controllers_1.mainCatController.putUpdateMainCategory);
router.get("/:categoryId", validator_1.default.getMainCategory, controllers_1.mainCatController.getMainCategory);
router.delete("/:categoryId", isAdminAuth_1.isAdmin, validator_1.default.deleteMainCategory, controllers_1.mainCatController.deleteMainCategory);
exports.default = router;
