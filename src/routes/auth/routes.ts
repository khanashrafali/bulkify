import { Router } from "express";
import { authCtrl } from "../../controllers";
import { fileHandler } from "../../utils";
import { UserRole } from "../../utils/interfaces";
import { isAdmin } from "../middlewares/isAdminAuth";
import { isAuth } from "../middlewares/isAuth";
import { isVendor } from "../middlewares/isVendorAuth";
import validator from "./validator";

const router = Router();

router.get("/me", isAuth([UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.VENDOR, UserRole.USER]), authCtrl.getMyInfo);
router.get("/token/validate", validator.getValidateToken, authCtrl.getValidateToken);

router.post("/app-login", validator.userLogin, authCtrl.userLogin);
router.post("/app-signup", validator.userSignup, authCtrl.userSignup);

router.post("/resend-otp", validator.resendOtp, authCtrl.resendOtp);
router.post("/verify-otp", validator.verifyOtp, authCtrl.verifyOtp);

//vendor auth apis
router.post("/vendor-login", validator.vendorLogin, authCtrl.vendorLogin);
router.post("/vendor-signup", validator.vendorSignup, authCtrl.vendorSignup);
router.post("/vendor-change-password", isVendor, validator.changePassword, authCtrl.vendorChangePassword);

router.post("/resend-vendor-email", validator.resendVendorEmail, authCtrl.resendVendorEmail);
router.get("/verify-vendor-email/:token", validator.verifyVendorEmail, authCtrl.verifyVendorEmail);
router.put("/vendor-reset-password/:token", validator.putResetAdminPassword, authCtrl.putResetVendorPassword);
router.post(
  "/vendor-forgot-password-mail",
  validator.postSendVendorForgotPasswordMail,
  authCtrl.postSendVendorForgotPasswordMail
);

// admin auth apis
router.post("/admin-login", validator.adminLogin, authCtrl.adminLogin);
router.post("/admin-signup", validator.adminSignup, authCtrl.adminSignup);
router.post("/admin-change-password", isAdmin, validator.changePassword, authCtrl.adminChangePassword);
router.put("/admin-reset-password/:token", validator.putResetAdminPassword, authCtrl.putResetAdminPassword);
router.post(
  "/admin-forgot-password-mail",
  validator.postSendAdminForgotPasswordMail,
  authCtrl.postSendAdminForgotPasswordMail
);

router.post("/resend-admin-email", validator.resendAdminEmail, authCtrl.resendAdminEmail);
router.get("/verify-admin-email/:token", validator.verifyAdminEmail, authCtrl.verifyAdminEmail);

router.post(
  "/upload-files",
  isAuth([UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.VENDOR, UserRole.USER]),
  fileHandler.uploadProductFilesToS3("files").any(),
  authCtrl.postUploadFiles
);

export default router;
