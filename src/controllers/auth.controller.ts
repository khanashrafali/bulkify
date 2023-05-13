import { NextFunction, Request, Response } from "express";
import { matchedData } from "express-validator";
import { authService } from "../services";
import { helper } from "../utils";
import { IRequest } from "../utils/interfaces";

/**
 * get my account details
 */
const getMyInfo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    let result = await authService.getMyInfo(req as IRequest);
    helper.buildResponse(res, "account details", result);
  } catch (error) {
    next(error);
  }
};

/**
 * login user api
 */
const userLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    await authService.userLogin(req.body.emailOrMobile, res);
  } catch (error) {
    next(error);
  }
};

/**
 * signup user api
 */
const userSignup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    let result = await authService.userSignup(req.body.name, req.body.emailOrMobile);
    helper.buildResponse(res, "Please verify the OTP sent to your mobile number", result);
  } catch (error) {
    next(error);
  }
};

/**
 * verify mobile otp api
 */
const verifyOtp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    let result = await authService.verifyOtp(req.body.emailOrMobile, req.body.otp);
    helper.buildResponse(res, "OTP verified successfully", result);
  } catch (error) {
    next(error);
  }
};

/**
 * resend mobile otp api
 */
const resendOtp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    let result = await authService.resendOtp(req.body.emailOrMobile);
    helper.buildResponse(res, `OTP has been sent to your registered Email ID/Mobile No.`, result);
  } catch (error) {
    next(error);
  }
};

/**
 * admin login api
 */
const adminLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    let result = await authService.adminLogin(req.body.email, req.body.password);
    helper.buildResponse(res, "You are successfully logged in", result);
  } catch (error) {
    next(error);
  }
};

/**
 * admin signup api
 */
const adminSignup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    let result = await authService.adminSignup(req.body.email, req.body.password, req.body.confirmPassword);
    helper.buildResponse(res, "Please verify email to registered successfully", result);
  } catch (error) {
    next(error);
  }
};

/**
 * verify email api
 */
const verifyAdminEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    let result = await authService.verifyAdminEmail(req.params.token);
    helper.buildResponse(res, "Email Verified Successfully!", result);
  } catch (error) {
    next(error);
  }
};

/**
 * resend email api
 */
const resendAdminEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    let result = await authService.resendAdminEmail(req.body.email);
    helper.buildResponse(res, "Email sent successfully", result);
  } catch (error) {
    next(error);
  }
};

/**
 * upload files api
 */
const postUploadFiles = (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.checkPayloadFiles(req);
    helper.buildResponse(res, "Files uploaded Successfully", req.files || req.file);
  } catch (error) {
    next(error);
  }
};

/**
 * vendor login user api
 */
const vendorLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    let result = await authService.vendorLogin(req.body.email, req.body.password);
    helper.buildResponse(res, "You are successfully logged in", result);
  } catch (error) {
    next(error);
  }
};

/**
 * vendor signup user api
 */
const vendorSignup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    let result = await authService.vendorSignup(req.body.email, req.body.password, req.body.confirmPassword);
    helper.buildResponse(res, "Please verify email to registered successfully", result);
  } catch (error) {
    next(error);
  }
};

/**
 * verify vendor email api
 */
const verifyVendorEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    let result = await authService.verifyVendorEmail(req.params.token);
    helper.buildResponse(res, "Email Verified Successfully!", result);
  } catch (error) {
    next(error);
  }
};

/**
 * resend vendor email api
 */
const resendVendorEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    let result = await authService.resendVendorEmail(req.body.email);
    helper.buildResponse(res, "Email sent successfully", result);
  } catch (error) {
    next(error);
  }
};

// validate auth token
const getValidateToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    let result = await authService.verifyAuthToken(req.query.token as string, req.query.role as any);
    helper.buildResponse(res, "Token validated successfully", { isValid: result });
  } catch (error) {
    next(error);
  }
};

const vendorChangePassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    await authService.changePassword(req as IRequest, matchedData(req));
    helper.buildResponse(res, "Password changed successfully");
  } catch (error) {
    next(error);
  }
};

const adminChangePassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    await authService.changePassword(req as IRequest, matchedData(req));
    helper.buildResponse(res, "Password changed successfully");
  } catch (error) {
    next(error);
  }
};

/**
 * reset admin password
 */
const putResetAdminPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    let result = await authService.resetAdminPassword(req.params.token, req.body.confirmPassword);
    helper.buildResponse(res, "New password set successfully", result);
  } catch (error) {
    next(error);
  }
};

/**
 * reset vendor password
 */
const putResetVendorPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    let result = await authService.resetVendorPassword(req.params.token, req.body.confirmPassword);
    helper.buildResponse(res, "New password set successfully", result);
  } catch (error) {
    next(error);
  }
};

/**
 * sen  email for admin forgot password
 */
const postSendAdminForgotPasswordMail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    let result = await authService.sendAdminForgotPasswordEmail(req.body.email);
    helper.buildResponse(res, "Verification link sent to your email, Please check", result);
  } catch (error) {
    next(error);
  }
};

/**
 * send email for vendor forgot password
 */
const postSendVendorForgotPasswordMail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    let result = await authService.sendVendorForgotPasswordEmail(req.body.email);
    helper.buildResponse(res, "Verification link sent to your email, Please check", result);
  } catch (error) {
    next(error);
  }
};

export default {
  userLogin,
  userSignup,
  verifyOtp,
  resendOtp,
  adminLogin,
  adminSignup,
  vendorLogin,
  vendorSignup,
  verifyAdminEmail,
  resendAdminEmail,
  verifyVendorEmail,
  resendVendorEmail,
  postUploadFiles,
  getValidateToken,
  getMyInfo,
  vendorChangePassword,
  adminChangePassword,
  putResetAdminPassword,
  putResetVendorPassword,
  postSendAdminForgotPasswordMail,
  postSendVendorForgotPasswordMail,
};
