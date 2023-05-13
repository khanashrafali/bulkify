import { Router } from "express";
import { sliderCtrl } from "../../controllers";
import authController from "../../controllers/auth.controller";
import { fileHandler, helper } from "../../utils";
import { isAdmin } from "../middlewares/isAdminAuth";
import validator from "./validator";

const router = Router();

router.post("/long-file", isAdmin, fileHandler.uploadFile().any(), async (req, res, next) => {
  try {
    let s3Images = await fileHandler.uploadLongSliderFilesToS3(req.files as any[]);
    let images = s3Images.map((f) => f.variant);
    helper.buildResponse(res, "File Uploaded Successfully.", images);
  } catch (error) {
    next(error);
  }
});

router.post("/short-file", isAdmin, fileHandler.uploadFile().any(), async (req, res, next) => {
  try {
    let s3Images = await fileHandler.uploadShortSliderFilesToS3(req.files as any[]);
    let images = s3Images.map((f) => f.variant);
    helper.buildResponse(res, "File Uploaded Successfully.", images);
  } catch (error) {
    next(error);
  }
});

router.post("", isAdmin, validator.addSlider, sliderCtrl.addSlider);
router.put("", isAdmin, validator.addSlider, sliderCtrl.updateSlider);
router.get("", validator.getSlider, sliderCtrl.getSlider);
router.delete("/:slideId", isAdmin, validator.deleteSliderSlide, sliderCtrl.deleteSliderSlide);

export default router;
