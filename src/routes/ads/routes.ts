import { Router } from "express";
import { adsController } from "../../controllers";
import { fileHandler } from "../../utils";
import { isAdmin } from "../middlewares/isAdminAuth";
import { isUser } from "../middlewares/isUserAuth";
import validator from "./validator";

const router = Router();

router.post("", isAdmin, fileHandler.uploadAdsFilesToS3("ads").single("file"), validator.addAds, adsController.addAds);
router.get("", adsController.getAdss);
router.put(
  "/:adsId",
  isAdmin,
  fileHandler.uploadAdsFilesToS3("ads").single("file"),
  validator.updateAds,
  adsController.updateAds
);
router.get("/:adsId", validator.getAds, adsController.getAds);
router.delete("/:adsId", isAdmin, validator.deleteAds, adsController.deleteAds);

export default router;
