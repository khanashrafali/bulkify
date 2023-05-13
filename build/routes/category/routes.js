"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../../controllers");
const isAdminAuth_1 = require("../middlewares/isAdminAuth");
const validator_1 = __importDefault(require("./validator"));
const utils_1 = require("../../utils");
const auth_controller_1 = __importDefault(require("../../controllers/auth.controller"));
const router = (0, express_1.Router)();
router.post("/uploads", isAdminAuth_1.isAdmin, utils_1.fileHandler.uploadBrandAndCategoryFilesToS3("categories").single("file"), auth_controller_1.default.postUploadFiles);
// sub category routes
router.post("/sub-categories/:mainCategoryId", isAdminAuth_1.isAdmin, validator_1.default.postCreateSubCategory, controllers_1.categoryCtrl.postCreateSubCategory);
router.put("/sub-categories/:categoryId", isAdminAuth_1.isAdmin, validator_1.default.putUpdateSubCategory, controllers_1.categoryCtrl.putUpdateSubCategory);
router.get("/sub-categories/:subCategoryId", validator_1.default.getSubCategory, controllers_1.categoryCtrl.getSubCategory);
router.get("/sub-categories/list/by-admin/:mainCategoryId", isAdminAuth_1.isAdmin, validator_1.default.getSubCategories, controllers_1.categoryCtrl.getSubCategoriesByAdmin);
router.get("/sub-categories/list/:mainCategoryId", validator_1.default.getSubCategories, controllers_1.categoryCtrl.getSubCategories);
router.delete("/sub-categories/:subCategoryId", isAdminAuth_1.isAdmin, validator_1.default.deleteSubCategory, controllers_1.categoryCtrl.deleteSubCategory);
// main categories routes
router.post("", isAdminAuth_1.isAdmin, validator_1.default.postCreateMainCategory, controllers_1.categoryCtrl.postCreateMainCategory);
router.get("", validator_1.default.getMainCategories, controllers_1.categoryCtrl.getMainCategories);
router.get("/by-admin", validator_1.default.getMainCategories, controllers_1.categoryCtrl.getMainCategoriesByAdmin);
router.patch("/:categoryId", isAdminAuth_1.isAdmin, validator_1.default.patchUpdateCategoryStatus, controllers_1.categoryCtrl.patchUpdateCategoryStatus);
router.put("/:mainCategoryId", isAdminAuth_1.isAdmin, validator_1.default.putUpdateMainCategory, controllers_1.categoryCtrl.putUpdateMainCategory);
router.get("/:mainCategoryId", validator_1.default.getMainCategory, controllers_1.categoryCtrl.getMainCategory);
router.delete("/:mainCategoryId", isAdminAuth_1.isAdmin, validator_1.default.deleteMainCategory, controllers_1.categoryCtrl.deleteMainCategory);
exports.default = router;
