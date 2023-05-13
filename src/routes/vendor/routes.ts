import { Router } from "express";
import { vendorCtrl } from "../../controllers";
import { CONSTANT, fileHandler } from "../../utils";
import { UserRole } from "../../utils/interfaces";
import { isAdmin } from "../middlewares/isAdminAuth";
import { isAuth } from "../middlewares/isAuth";
import { isUser } from "../middlewares/isUserAuth";
import { isVendor } from "../middlewares/isVendorAuth";
import validator from "./validator";

const router = Router();

router.post(
  "/became-a-vendor",
  isUser,
  fileHandler.uploadProductFilesToS3("vendors").fields([
    { name: "avatar", maxCount: 1 },
    { name: "images", maxCount: 5 },
    { name: "video", maxCount: 1 },
  ]),
  validator.becameAVendor,
  vendorCtrl.becameAVendor
);

router.post(
  "/complete-profile",
  isVendor,
  fileHandler.uploadProductFilesToS3("vendors").fields([
    { name: "avatar", maxCount: 1 },
    { name: "images", maxCount: 5 },
    { name: "video", maxCount: 1 },
  ]),
  validator.completeVendorProfile,
  vendorCtrl.completeVendorProfile
);

router.post(
  "/",
  isAdmin,
  fileHandler.uploadProductFilesToS3("vendors").fields([
    { name: "avatar", maxCount: 1 },
    { name: "images", maxCount: 5 },
    { name: "video", maxCount: 1 },
  ]),
  validator.addVendor,
  vendorCtrl.addVendor
);

router.put("/:vendorId", isAdmin, validator.updateVendor, vendorCtrl.updateVendor);
router.put("/:vendorId/update-profile", isVendor, validator.updateVendorProfile, vendorCtrl.updateVendorProfile);
router.patch("/approve/:vendorId", isAdmin, validator.patchUpdateApproval, vendorCtrl.patchUpdateApproval);

router.delete("/:vendorId", isAdmin, validator.getVendor, vendorCtrl.deleteVendor);
router.get("/by-admin", isAdmin, validator.getVendors, vendorCtrl.getVendorsByAdmin);
router.get(
  "/:vendorId",
  isAuth([UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.VENDOR]),
  validator.getVendor,
  vendorCtrl.getVendor
);
router.patch("/:vendorId", isAdmin, validator.updateVendorStatus, vendorCtrl.updateVendorStatus);
router.get("", validator.getVendors, vendorCtrl.getVendors);
router.get("/generate-new-password/:vendorId", isAdmin, vendorCtrl.generateNewPassword);

export default router;
