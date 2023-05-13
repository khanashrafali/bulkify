import { Router } from "express";
import { brandController } from "../../controllers";
import authController from "../../controllers/auth.controller";
import { fileHandler } from "../../utils";
import { isAdmin } from "../middlewares/isAdminAuth";
import { isUser } from "../middlewares/isUserAuth";
import validator from "./validator";

const router = Router();

router.post(
  "/uploads",
  isAdmin,
  fileHandler.uploadBrandAndCategoryFilesToS3("brands").single("file"),
  authController.postUploadFiles
);

router.post("", isAdmin, validator.addBrand, brandController.addBrand);
router.get("", brandController.getBrands);
router.get("/by-admin", brandController.getBrandsByAdmin);
router.put("/:brandId", isAdmin, validator.updateBrand, brandController.updateBrand);
router.patch("/:brandId", isAdmin, validator.updateStatus, brandController.updateStatus);
router.get("/:brandId", validator.getBrand, brandController.getBrand);
router.delete("/:brandId", isAdmin, validator.deleteBrand, brandController.deleteBrand);

export default router;
