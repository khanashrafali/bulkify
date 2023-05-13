import { Router } from "express";
import { categoryCtrl } from "../../controllers";
import { isAuth } from "../middlewares/isAuth";
import { isAdmin } from "../middlewares/isAdminAuth";
import validator from "./validator";
import { fileHandler } from "../../utils";
import authController from "../../controllers/auth.controller";

const router = Router();

router.post(
  "/uploads",
  isAdmin,
  fileHandler.uploadBrandAndCategoryFilesToS3("categories").single("file"),
  authController.postUploadFiles
);

// sub category routes
router.post(
  "/sub-categories/:mainCategoryId",
  isAdmin,
  validator.postCreateSubCategory,
  categoryCtrl.postCreateSubCategory
);
router.put("/sub-categories/:categoryId", isAdmin, validator.putUpdateSubCategory, categoryCtrl.putUpdateSubCategory);
router.get("/sub-categories/:subCategoryId", validator.getSubCategory, categoryCtrl.getSubCategory);
router.get(
  "/sub-categories/list/by-admin/:mainCategoryId",
  isAdmin,
  validator.getSubCategories,
  categoryCtrl.getSubCategoriesByAdmin
);
router.get("/sub-categories/list/:mainCategoryId", validator.getSubCategories, categoryCtrl.getSubCategories);
router.delete("/sub-categories/:subCategoryId", isAdmin, validator.deleteSubCategory, categoryCtrl.deleteSubCategory);

// main categories routes
router.post("", isAdmin, validator.postCreateMainCategory, categoryCtrl.postCreateMainCategory);
router.get("", validator.getMainCategories, categoryCtrl.getMainCategories);
router.get("/by-admin", validator.getMainCategories, categoryCtrl.getMainCategoriesByAdmin);
router.patch("/:categoryId", isAdmin, validator.patchUpdateCategoryStatus, categoryCtrl.patchUpdateCategoryStatus);
router.put("/:mainCategoryId", isAdmin, validator.putUpdateMainCategory, categoryCtrl.putUpdateMainCategory);
router.get("/:mainCategoryId", validator.getMainCategory, categoryCtrl.getMainCategory);
router.delete("/:mainCategoryId", isAdmin, validator.deleteMainCategory, categoryCtrl.deleteMainCategory);

export default router;
