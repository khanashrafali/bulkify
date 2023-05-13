import { Router } from "express";
import { userCtrl } from "../../controllers";
import { UserRole } from "../../utils/interfaces";
import { isAdmin } from "../middlewares/isAdminAuth";
import { isAuth } from "../middlewares/isAuth";
import { isUser } from "../middlewares/isUserAuth";
import { isVendor } from "../middlewares/isVendorAuth";
import validator from "./validator";

const router = Router();

router.put("/update/me", isUser, validator.updateProfile, userCtrl.updateProfile);
router.patch("/:userId", isAdmin, validator.updateStatus, userCtrl.updateStatus);
router.delete("/delete/me", isUser, userCtrl.deleteMe);
router.get("", isAdmin, validator.getUsers, userCtrl.getAppUsers);
router.get(
  "/admin-dashboard",
  isAuth([UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.VENDOR]),
  userCtrl.adminDashboradInfo
);
router.get("/vendor-dashboard", isVendor, userCtrl.vendorDashboradInfo);
router.post("/subscribe", validator.postSubscribe, userCtrl.postSubscribe);
router.post("/user-feedback", validator.postUserFeedback, userCtrl.postUserFeedback);
router.get("/user-feedback", userCtrl.getFeedBacks);
router.get("/app-home", userCtrl.getAppHomePage);

export default router;
