import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import moment from "moment";
import validator from "validator";
import randomStr from "randomstring";
import { userModel, vendorModel, adminModel } from "../models";
import { emailHandler, helper, otpHandler } from "../utils";
import { ApprovalStatus, IRequest, UserRole, VerificationType } from "../utils/interfaces";
import { Response } from "express";

helper.loadEnvFile();

/**
 * build json web token
 */
const buildAuthToken = (id: string, email?: string, mobileNumber?: string, expiresIn: string | number = "1y") => {
  return jwt.sign({ email, mobileNumber, id }, process.env.JWT_SECRET as string, { expiresIn });
};

/**
 * login handler
 */
const userLogin = async (emailOrMobile: string, res: Response) => {
  let newUser;
  try {
    const isMobile = validator.isMobilePhone(emailOrMobile, "en-IN");
    const device = isMobile ? "Mobile" : "Email";
    let conditions: any = isMobile ? { mobileNumber: emailOrMobile } : { email: emailOrMobile };
    const user = await userModel.findOne(conditions);

    if (user) {
      let userObj: any = user.toJSON();

      if (!userObj.isActive) throw helper.buildError("Your account is deactivated by admin, Please contact to admin Or Try again after some time.", 422);

      if (userObj.expirationTime && moment(userObj.expirationTime).isAfter(moment())) {
        let leftMin = moment(userObj.expirationTime).subtract(moment().minutes(), "minutes").minutes();
        throw helper.buildError(`Please enter old otp sent to your ${device}, or wait ${leftMin} min, till old otp expire.`, 200);
      }
    }

    // const varificationToken = "1234";
    const varificationToken = randomStr.generate({ charset: "numeric", length: 4 });
    const expirationTime = moment().add(5, "minute");
    const userData: any = { ...conditions, varificationToken, expirationTime: expirationTime, isActive: true };

    if (!user) newUser = await userModel.create({ ...userData });
    else newUser = await user.set({ ...userData }).save();

    helper.buildResponse(res, `Please verify the OTP sent to your ${isMobile ? "mobile number" : "email"}.`);

    if (isMobile) await otpHandler.userLoginOTP((newUser as any).mobileNumber, varificationToken);
    else await emailHandler.userLoginOtpMail(emailOrMobile, varificationToken);
  } catch (error) {
    if (newUser) await newUser.remove();
    throw error;
  }
};

/**
 * signup handler
 */
const userSignup = async (name: string, emailOrMobile: string) => {
  let newUser;
  try {
    const isMobile = validator.isMobilePhone(emailOrMobile, "en-IN");
    let conditions: any = isMobile ? { mobileNumber: emailOrMobile } : { email: emailOrMobile };
    const user = await userModel.findOne(conditions);

    if (user) {
      const userObj: any = user.toJSON();
      if (userObj.expirationTime && moment(userObj.expirationTime).isAfter(moment())) {
        let leftmin = moment(userObj.expirationTime).subtract(moment().minutes(), "minutes").minutes();
        throw helper.buildError(`Please enter old otp sent to your mobile, or wait ${leftmin} min, till old otp expire.`, 400);
      }
    }

    // const varificationToken = randomStr.generate({ charset: "numeric", length: 4 });
    const varificationToken = "1234";
    const expirationTime = moment().add(1, "minute");
    const userData = { name, ...conditions, varificationToken, expirationTime, isActive: true };

    if (!user) newUser = await userModel.create(userData);
    else newUser = await user.set(userData).save();

    // if (isMobile) await helper.sendOTP(userData.mobileNumber, `From ${varificationToken} Webmobril`);
    return { varificationToken };
  } catch (error) {
    if (newUser) await newUser.remove();
    throw error;
  }
};

/**
 * verify OTP handler
 */
const verifyOtp = async (emailOrMobile: string, varificationToken: string) => {
  try {
    const isMobile = validator.isMobilePhone(emailOrMobile, "en-IN");
    let conditions = isMobile ? { mobileNumber: emailOrMobile } : { email: emailOrMobile };
    let user = await userModel.findOne({ ...conditions, varificationToken });

    if (!user) throw helper.buildError("Please enter valid OTP.", 400);

    const userObj: any = user.toJSON();

    if (userObj.expirationTime && moment(userObj.expirationTime).isSameOrBefore(moment())) throw helper.buildError("OTP is expired", 400);

    await user
      .set({
        ...userObj.meta,
        varificationToken: null,
        blockDate: null,
        VerificationType: null,
        expirationTime: null,
        isMobileVerified: isMobile,
        isEmailVerified: !isMobile,
        wrongAuthCount: 0,
      })
      .save();

    const token = buildAuthToken(userObj._id, userObj.email, userObj.mobileNumber);
    return { token, _id: userObj._id, name: userObj.name, email: userObj.email, mobileNumber: userObj.mobileNumber, role: userObj.role };
  } catch (error) {
    throw error;
  }
};

/**
 * resend Otp handler
 */
const resendOtp = async (emailOrMobile: string) => {
  try {
    const isMobile = validator.isMobilePhone(emailOrMobile, "en-IN");
    let conditions = isMobile ? { mobileNumber: emailOrMobile } : { email: emailOrMobile };
    const user = await userModel.findOne(conditions);

    if (!user) throw helper.buildError("No user found with this mobile number.", 400);

    const userObj: any = user.toJSON();
    let blockDate = userObj.blockDate;

    if (!userObj.varificationToken) throw helper.buildError("invalid mobile number!", 400);

    if (userObj.expirationTime && moment(userObj.expirationTime).isAfter(moment())) {
      let leftMinutes = moment(userObj.expirationTime).subtract(moment().minutes(), "minutes").minutes();
      throw helper.buildError(`Please enter old otp sent to your mobile, or wait ${leftMinutes} min till old otp expire.`, 400);
    }

    // if (userObj.isMobileVerified && !userObj.varificationToken) {
    //   throw helper.buildError("Your mobile already verified", 400);
    // }

    if (userObj.wrongAuthCount >= 4) {
      if (!userObj.blockDate) {
        blockDate = Date.now();
        await user.set({ blockDate }).save();
      }

      let expDate = moment(blockDate).add(5, "minutes");

      if (expDate.isAfter(moment())) throw helper.buildError("your account temporary blocked, Please contact to admin", 400);
      else {
        userObj.wrongAuthCount = 0;
        await user.set({ wrongAuthCount: 0, blockDate: null }).save();
      }
    }

    let wrongAuthCount = (userObj.wrongAuthCount || 0) + 1;
    // const varificationToken = randomStr.generate({ charset: "numeric", length: 4 });
    const varificationToken = "4321";
    const expirationTime = moment().add(1, "minute");
    await user.set({ varificationToken, expirationTime, wrongAuthCount }).save();

    // if (isMobile) await otpHandler.userLoginOTP(emailOrMobile, varificationToken);
    // else await emailHandler.userLoginOtpMail(emailOrMobile, varificationToken);
    return { varificationToken, isMobile };
  } catch (error) {
    throw error;
  }
};

/**
 * admin login handler
 */
const adminLogin = async (email: string, password: string) => {
  try {
    const user = await adminModel.findOne({ email }).populate("adminRole");
    // if (!user) throw helper.buildError("No admin found with this email", 404);
    if (!user) throw helper.buildError("Invalid email or password.", 404);
    const userToJson: any = user.toJSON();

    if (userToJson.role == UserRole.ADMIN && !userToJson.isActive) {
      throw helper.buildError("Your account is deactived by super admin, Kindly get in touch with Super Admin", 400);
    }

    const isValidPassword = await bcrypt.compare(password, userToJson.password);
    if (!isValidPassword) throw helper.buildError("Invalid email or password.", 400);
    const token = buildAuthToken(userToJson._id, userToJson.email, userToJson.mobileNumber);
    return { token, ...userToJson };
  } catch (error) {
    throw error;
  }
};

/**
 * admin signup handler
 */
const adminSignup = async (email: string, password: string, confirmPassword: string) => {
  let newUser;
  try {
    if (confirmPassword != password) throw helper.buildError("Password and confirm must be same", 400);
    let superAdmin = await adminModel.findOne({ role: UserRole.SUPER_ADMIN });

    if (superAdmin) throw helper.buildError("Super admin already exists.", 401);
    const user = await adminModel.findOne({ email });

    if (user) {
      const userToJson: any = user.toJSON();
      if (userToJson.isEmailVerified) throw helper.buildError("Email already registered.", 400);
      if (!userToJson.isEmailVerified) {
        if (userToJson.expirationTime && moment(userToJson.expirationTime).isAfter(moment())) {
          throw helper.buildError("Please verify email to registered successfully", 400);
        }
      }
    }

    // const varificationToken = randomStr.generate({ charset: "numeric", length: 4 });
    const varificationToken = helper.getHash();
    const expirationTime = moment(moment()).add(5, "minutes");
    const hashPassword = await bcrypt.hash(password, 12);
    const userData = {
      email,
      password: hashPassword,
      varificationToken,
      expirationTime,
      role: UserRole.SUPER_ADMIN,
      isActive: true,
    };

    if (!user) newUser = await adminModel.create(userData);
    else newUser = await user.set(userData).save();

    // send email
    // await helper.sendOTP(
    //   userData.mobileNumber,
    //   `From ${varificationToken} Webmobril`
    // );

    return { url: `${process.env.BASE_URL}/api/v1/auth/verify-admin-email/${varificationToken}` };
  } catch (error) {
    if (newUser) await newUser.remove();
    throw error;
  }
};

/**
 * vendor login handler
 */
const vendorLogin = async (email: string, password: string) => {
  try {
    const user = await vendorModel.findOne({ email });
    if (!user) throw helper.buildError("No vendor found with this email", 404);
    const userToJson: any = user.toJSON();

    if (userToJson.isApproved !== ApprovalStatus.APPROVED) throw helper.buildError("Your account is under verification", 400);

    const isValidPassword = await bcrypt.compare(password, userToJson.password);
    if (!isValidPassword) throw helper.buildError("Incorrect password", 400);

    const token = buildAuthToken(userToJson._id, userToJson.email, userToJson.mobileNumber);
    return { token, ...userToJson };
  } catch (error) {
    throw error;
  }
};

/**
 * vendor signup handler
 */
const vendorSignup = async (email: string, password: string, confirmPassword: string) => {
  let newUser;
  try {
    if (confirmPassword != password) throw helper.buildError("Password and confirm must be same", 400);
    const user = await vendorModel.findOne({ email });

    if (user) {
      const userToJson: any = user.toJSON();
      if (userToJson.isEmailVerified) throw helper.buildError("Email already registered.", 400);
      if (!userToJson.isEmailVerified) {
        if (userToJson.expirationTime && moment(userToJson.expirationTime).isAfter(moment())) {
          throw helper.buildError("Please verify email to registered successfully", 400);
        }
      }
    }

    // const varificationToken = randomStr.generate({ charset: "numeric", length: 4 });
    const varificationToken = helper.getHash();
    const expirationTime = moment(moment()).add(5, "minutes");
    const hashPassword = await bcrypt.hash(password, 12);
    const userData = { email, password: hashPassword, varificationToken, expirationTime, role: UserRole.SUPER_ADMIN };

    if (!user) newUser = await vendorModel.create(userData);
    else newUser = await user.set(userData).save();

    // send email
    // await helper.sendOTP(
    //   userData.mobileNumber,
    //   `From ${varificationToken} Webmobril`
    // );

    return { url: `${process.env.BASE_URL}/api/v1/auth/verify-vendor-email/${varificationToken}` };
  } catch (error) {
    if (newUser) await newUser.remove();
    throw error;
  }
};

/**
 * verify admin email handler
 */
const verifyAdminEmail = async (varificationToken: string) => {
  try {
    const user = await adminModel.findOne({ varificationToken });
    if (!user) throw helper.buildError("Please enter valid varification token", 400);
    const userToJson: any = user.toJSON();

    if (userToJson.expirationTime && moment(userToJson.expirationTime).isBefore(moment())) throw helper.buildError("Link expired", 400);

    let data: any = { varificationToken: null, expirationTime: null, isEmailVerified: true };
    if (userToJson.role == UserRole.SUPER_ADMIN) data.isApproved = ApprovalStatus.APPROVED;
    await user.set(data).save();
  } catch (error) {
    throw error;
  }
};

/**
 * resend admin email handler
 */
const resendAdminEmail = async (email: string) => {
  try {
    const user = await adminModel.findOne({ email });
    if (!user) throw helper.buildError("No user found with this email", 400);
    const userToJson: any = user.toJSON();
    if (userToJson.isEmailVerified) throw helper.buildError("Your email already verified", 400);
    if (userToJson.expirationTime && moment(userToJson.expirationTime).isAfter(moment())) throw helper.buildError("Email link has been already sent", 400);

    // const varificationToken = randomStr.generate({ charset: "numeric", length: 4 });
    const varificationToken = helper.getHash();
    const expirationTime = moment(moment()).add(5, "minutes");
    await user.set({ varificationToken, expirationTime }).save();
    // send email
    // await emailHandler.sentSignUpMail(userToJson, varificationToken);
    return { url: `${process.env.BASE_URL}/api/v1/auth/verify-email/${varificationToken}` };
  } catch (error) {
    throw error;
  }
};

/**
 * verify vendor email handler
 */
const verifyVendorEmail = async (varificationToken: string) => {
  try {
    const user = await vendorModel.findOne({ varificationToken });
    if (!user) throw helper.buildError("Please enter valid varification token", 400);
    const userToJson: any = user.toJSON();

    if (userToJson.expirationTime && moment(userToJson.expirationTime).isBefore(moment())) throw helper.buildError("Link expired", 400);

    let data: any = { varificationToken: null, expirationTime: null, isEmailVerified: true };
    await user.set(data).save();
  } catch (error) {
    throw error;
  }
};

/**
 * resend vendor email handler
 */
const resendVendorEmail = async (email: string) => {
  try {
    const user = await vendorModel.findOne({ email });
    if (!user) throw helper.buildError("No user found with this email", 400);
    const userToJson: any = user.toJSON();
    if (userToJson.isEmailVerified) throw helper.buildError("Your email already verified", 400);
    if (userToJson.expirationTime && moment(userToJson.expirationTime).isAfter(moment())) throw helper.buildError("Email link has been already sent", 400);

    // const varificationToken = randomStr.generate({ charset: "numeric", length: 4 });
    const varificationToken = helper.getHash();
    const expirationTime = moment(moment()).add(5, "minutes");
    await user.set({ varificationToken, expirationTime }).save();
    // send email
    // await emailHandler.sentSignUpMail(userToJson, varificationToken);
    return { url: `${process.env.BASE_URL}/api/v1/auth/verify-email/${varificationToken}` };
  } catch (error) {
    throw error;
  }
};

/**
 * verify auth token is valid
 */
const verifyAuthToken = async (token: string, role: UserRole) => {
  try {
    let authData: any = jwt.verify(token, process.env.JWT_SECRET as string);
    if (!authData) return false;
    const model = role == UserRole.VENDOR ? vendorModel : role == UserRole.USER ? userModel : adminModel;
    const authUser = await model.findOne({ _id: authData.id });
    if (!authUser) return false;
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * get auth user account details
 */
const getMyInfo = async (req: IRequest) => {
  try {
    let info: any = req.user.toJSON();
    delete info.password;
    return info;
  } catch (error) {
    throw error;
  }
};

const changePassword = async (req: IRequest, data: any) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = data;
    if (newPassword != confirmPassword) throw helper.buildError("New password and confirm password must be same.", 422);
    let iUser = req.user;
    let userObj: any = req.user.toJSON();
    const isMatch = await bcrypt.compare(oldPassword, userObj.password);
    if (!isMatch) throw helper.buildError("incorrect old password", 422);
    let newHashPass = await bcrypt.hash(newPassword, 12);
    await iUser.set({ password: newHashPass }).save();
  } catch (error) {
    throw error;
  }
};

/**
 * send admin forgot password email
 */
const sendAdminForgotPasswordEmail = async (email: string) => {
  try {
    let conditions = { email };
    let user = await adminModel.findOne(conditions);
    if (!user) throw helper.buildError("no admin found with this email", 400);

    const userObj: any = user.toJSON();

    if (userObj.expirationTime && moment(userObj.expirationTime).isAfter(moment())) {
      const url = `${process.env.BASE_URL}/admin-reset-password/${userObj.varificationToken}`;
      let leftMinutes = moment(userObj.expirationTime).subtract(moment().minutes(), "minutes").minutes();
      throw helper.buildError(`Please enter old otp sent to your mobile, or wait ${leftMinutes} min till old otp expire.`, 200, url);
    }

    const varificationToken = helper.getHash();
    const expirationTime = moment().add(1, "hour");

    await user.set({ varificationToken, expirationTime, VerificationType: VerificationType.ForgotPassword }).save();
    let url = await emailHandler.sentForgotPasswordEmail(userObj.email, varificationToken, "admin-reset-password");
    return url;
  } catch (error) {
    throw error;
  }
};

/**
 * reset admin password
 */
const resetAdminPassword = async (varificationToken: string, newPassword: string) => {
  try {
    let admin = await adminModel.findOne({ varificationToken });

    if (!admin) throw helper.buildError("invalid token", 400);

    let adminObj: any = admin.toJSON();

    if (adminObj.expirationTime && moment(adminObj.expirationTime).isSameOrBefore(moment())) throw helper.buildError("link expired, Please resend again", 400);

    const isEqual = await bcrypt.compare(newPassword, adminObj.password);

    if (isEqual) throw helper.buildError("don't use your old password", 400);

    let password = await bcrypt.hash(newPassword, +process.env.JWT_SALT!);

    await admin.set({ password, varificationToken: null, expirationTime: null, VerificationType: null }).save();
  } catch (error) {
    throw error;
  }
};

/**
 * send vendor forgot password email
 */
const sendVendorForgotPasswordEmail = async (email: string) => {
  try {
    let conditions = { email };
    let user = await vendorModel.findOne(conditions);
    if (!user) throw helper.buildError("no user found with user email", 400);

    const userObj: any = user.toJSON();

    if (userObj.expirationTime && moment(userObj.expirationTime).isAfter(moment())) {
      const url = `${process.env.BASE_URL}/vendor-reset-password/${userObj.varificationToken}`;
      let leftMinutes = moment(userObj.expirationTime).subtract(moment().minutes(), "minutes").minutes();
      throw helper.buildError(`Please enter old otp sent to your mobile, or wait ${leftMinutes} min till old otp expire.`, 200, url);
    }

    const varificationToken = helper.getHash();
    const expirationTime = moment().add(1, "hour");

    await user.set({ varificationToken, expirationTime, VerificationType: VerificationType.ForgotPassword }).save();
    let url = await emailHandler.sentForgotPasswordEmail(userObj.email, varificationToken, "vendor-reset-password");
    return url;
  } catch (error) {
    throw error;
  }
};

/**
 * reset vendor password
 */
const resetVendorPassword = async (varificationToken: string, newPassword: string) => {
  try {
    let admin = await vendorModel.findOne({ varificationToken });

    if (!admin) throw helper.buildError("invalid token", 400);

    let adminObj: any = admin.toJSON();

    if (adminObj.expirationTime && moment(adminObj.expirationTime).isSameOrBefore(moment())) throw helper.buildError("link expired, Please resend again", 400);

    const isEqual = await bcrypt.compare(newPassword, adminObj.password);

    if (isEqual) throw helper.buildError("don't use your old password", 400);

    let password = await bcrypt.hash(newPassword, +process.env.JWT_SALT!);

    await admin.set({ password, varificationToken: null, expirationTime: null, VerificationType: null }).save();
  } catch (error) {
    throw error;
  }
};

export default {
  userLogin,
  verifyOtp,
  resendOtp,
  getMyInfo,
  userSignup,
  adminLogin,
  adminSignup,
  vendorLogin,
  vendorSignup,
  verifyAuthToken,
  verifyAdminEmail,
  resendAdminEmail,
  verifyVendorEmail,
  resendVendorEmail,
  changePassword,
  sendAdminForgotPasswordEmail,
  resetAdminPassword,
  sendVendorForgotPasswordEmail,
  resetVendorPassword,
};
