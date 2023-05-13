import { Router } from "express";
import { mainCatController } from "../../controllers";
import { isAuth } from "../middlewares/isAuth";
import { isAdmin } from "../middlewares/isAdminAuth";
import validator from "./validator";

const router = Router();

router.post("", isAdmin, validator.postCreateMainCategory, mainCatController.postCreateMainCategory);
router.get("", validator.getMainCategories, mainCatController.getMainCategories);
router.get("/by-admin", isAdmin, validator.getMainCategories, mainCatController.getMainCategoriesByAdmin);
router.patch("/:categoryId", isAdmin, validator.patchUpdateCategoryStatus, mainCatController.patchUpdateCategoryStatus);
router.put("/:categoryId", isAdmin, validator.putUpdateMainCategory, mainCatController.putUpdateMainCategory);
router.get("/:categoryId", validator.getMainCategory, mainCatController.getMainCategory);
router.delete("/:categoryId", isAdmin, validator.deleteMainCategory, mainCatController.deleteMainCategory);

export default router;
