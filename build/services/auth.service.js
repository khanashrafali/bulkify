"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const moment_1 = __importDefault(require("moment"));
const validator_1 = __importDefault(require("validator"));
const randomstring_1 = __importDefault(require("randomstring"));
const models_1 = require("../models");
const utils_1 = require("../utils");
const interfaces_1 = require("../utils/interfaces");
utils_1.helper.loadEnvFile();
/**
 * build json web token
 */
const buildAuthToken = (id, email, mobileNumber, expiresIn = "1y") => {
    return jsonwebtoken_1.default.sign({ email, mobileNumber, id }, process.env.JWT_SECRET, { expiresIn });
};
/**
 * login handler
 */
const userLogin = (emailOrMobile, res) => __awaiter(void 0, void 0, void 0, function* () {
    let newUser;
    try {
        const isMobile = validator_1.default.isMobilePhone(emailOrMobile, "en-IN");
        const device = isMobile ? "Mobile" : "Email";
        let conditions = isMobile ? { mobileNumber: emailOrMobile } : { email: emailOrMobile };
        const user = yield models_1.userModel.findOne(conditions);
        if (user) {
            let userObj = user.toJSON();
            if (!userObj.isActive)
                throw utils_1.helper.buildError("Your account is deactivated by admin, Please contact to admin Or Try again after some time.", 422);
            if (userObj.expirationTime && (0, moment_1.default)(userObj.expirationTime).isAfter((0, moment_1.default)())) {
                let leftMin = (0, moment_1.default)(userObj.expirationTime).subtract((0, moment_1.default)().minutes(), "minutes").minutes();
                throw utils_1.helper.buildError(`Please enter old otp sent to your ${device}, or wait ${leftMin} min, till old otp expire.`, 200);
            }
        }
        // const varificationToken = "1234";
        const varificationToken = randomstring_1.default.generate({ charset: "numeric", length: 4 });
        const expirationTime = (0, moment_1.default)().add(5, "minute");
        const userData = Object.assign(Object.assign({}, conditions), { varificationToken, expirationTime: expirationTime, isActive: true });
        if (!user)
            newUser = yield models_1.userModel.create(Object.assign({}, userData));
        else
            newUser = yield user.set(Object.assign({}, userData)).save();
        utils_1.helper.buildResponse(res, `Please verify the OTP sent to your ${isMobile ? "mobile number" : "email"}.`);
        if (isMobile)
            yield utils_1.otpHandler.userLoginOTP(newUser.mobileNumber, varificationToken);
        else
            yield utils_1.emailHandler.userLoginOtpMail(emailOrMobile, varificationToken);
    }
    catch (error) {
        if (newUser)
            yield newUser.remove();
        throw error;
    }
});
/**
 * signup handler
 */
const userSignup = (name, emailOrMobile) => __awaiter(void 0, void 0, void 0, function* () {
    let newUser;
    try {
        const isMobile = validator_1.default.isMobilePhone(emailOrMobile, "en-IN");
        let conditions = isMobile ? { mobileNumber: emailOrMobile } : { email: emailOrMobile };
        const user = yield models_1.userModel.findOne(conditions);
        if (user) {
            const userObj = user.toJSON();
            if (userObj.expirationTime && (0, moment_1.default)(userObj.expirationTime).isAfter((0, moment_1.default)())) {
                let leftmin = (0, moment_1.default)(userObj.expirationTime).subtract((0, moment_1.default)().minutes(), "minutes").minutes();
                throw utils_1.helper.buildError(`Please enter old otp sent to your mobile, or wait ${leftmin} min, till old otp expire.`, 400);
            }
        }
        // const varificationToken = randomStr.generate({ charset: "numeric", length: 4 });
        const varificationToken = "1234";
        const expirationTime = (0, moment_1.default)().add(1, "minute");
        const userData = Object.assign(Object.assign({ name }, conditions), { varificationToken, expirationTime, isActive: true });
        if (!user)
            newUser = yield models_1.userModel.create(userData);
        else
            newUser = yield user.set(userData).save();
        // if (isMobile) await helper.sendOTP(userData.mobileNumber, `From ${varificationToken} Webmobril`);
        return { varificationToken };
    }
    catch (error) {
        if (newUser)
            yield newUser.remove();
        throw error;
    }
});
/**
 * verify OTP handler
 */
const verifyOtp = (emailOrMobile, varificationToken) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isMobile = validator_1.default.isMobilePhone(emailOrMobile, "en-IN");
        let conditions = isMobile ? { mobileNumber: emailOrMobile } : { email: emailOrMobile };
        let user = yield models_1.userModel.findOne(Object.assign(Object.assign({}, conditions), { varificationToken }));
        if (!user)
            throw utils_1.helper.buildError("Please enter valid OTP.", 400);
        const userObj = user.toJSON();
        if (userObj.expirationTime && (0, moment_1.default)(userObj.expirationTime).isSameOrBefore((0, moment_1.default)()))
            throw utils_1.helper.buildError("OTP is expired", 400);
        yield user
            .set(Object.assign(Object.assign({}, userObj.meta), { varificationToken: null, blockDate: null, VerificationType: null, expirationTime: null, isMobileVerified: isMobile, isEmailVerified: !isMobile, wrongAuthCount: 0 }))
            .save();
        const token = buildAuthToken(userObj._id, userObj.email, userObj.mobileNumber);
        return { token, _id: userObj._id, name: userObj.name, email: userObj.email, mobileNumber: userObj.mobileNumber, role: userObj.role };
    }
    catch (error) {
        throw error;
    }
});
/**
 * resend Otp handler
 */
const resendOtp = (emailOrMobile) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isMobile = validator_1.default.isMobilePhone(emailOrMobile, "en-IN");
        let conditions = isMobile ? { mobileNumber: emailOrMobile } : { email: emailOrMobile };
        const user = yield models_1.userModel.findOne(conditions);
        if (!user)
            throw utils_1.helper.buildError("No user found with this mobile number.", 400);
        const userObj = user.toJSON();
        let blockDate = userObj.blockDate;
        if (!userObj.varificationToken)
            throw utils_1.helper.buildError("invalid mobile number!", 400);
        if (userObj.expirationTime && (0, moment_1.default)(userObj.expirationTime).isAfter((0, moment_1.default)())) {
            let leftMinutes = (0, moment_1.default)(userObj.expirationTime).subtract((0, moment_1.default)().minutes(), "minutes").minutes();
            throw utils_1.helper.buildError(`Please enter old otp sent to your mobile, or wait ${leftMinutes} min till old otp expire.`, 400);
        }
        // if (userObj.isMobileVerified && !userObj.varificationToken) {
        //   throw helper.buildError("Your mobile already verified", 400);
        // }
        if (userObj.wrongAuthCount >= 4) {
            if (!userObj.blockDate) {
                blockDate = Date.now();
                yield user.set({ blockDate }).save();
            }
            let expDate = (0, moment_1.default)(blockDate).add(5, "minutes");
            if (expDate.isAfter((0, moment_1.default)()))
                throw utils_1.helper.buildError("your account temporary blocked, Please contact to admin", 400);
            else {
                userObj.wrongAuthCount = 0;
                yield user.set({ wrongAuthCount: 0, blockDate: null }).save();
            }
        }
        let wrongAuthCount = (userObj.wrongAuthCount || 0) + 1;
        // const varificationToken = randomStr.generate({ charset: "numeric", length: 4 });
        const varificationToken = "4321";
        const expirationTime = (0, moment_1.default)().add(1, "minute");
        yield user.set({ varificationToken, expirationTime, wrongAuthCount }).save();
        // if (isMobile) await otpHandler.userLoginOTP(emailOrMobile, varificationToken);
        // else await emailHandler.userLoginOtpMail(emailOrMobile, varificationToken);
        return { varificationToken, isMobile };
    }
    catch (error) {
        throw error;
    }
});
/**
 * admin login handler
 */
const adminLogin = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield models_1.adminModel.findOne({ email }).populate("adminRole");
        // if (!user) throw helper.buildError("No admin found with this email", 404);
        if (!user)
            throw utils_1.helper.buildError("Invalid email or password.", 404);
        const userToJson = user.toJSON();
        if (userToJson.role == interfaces_1.UserRole.ADMIN && !userToJson.isActive) {
            throw utils_1.helper.buildError("Your account is deactived by super admin, Kindly get in touch with Super Admin", 400);
        }
        const isValidPassword = yield bcryptjs_1.default.compare(password, userToJson.password);
        if (!isValidPassword)
            throw utils_1.helper.buildError("Invalid email or password.", 400);
        const token = buildAuthToken(userToJson._id, userToJson.email, userToJson.mobileNumber);
        return Object.assign({ token }, userToJson);
    }
    catch (error) {
        throw error;
    }
});
/**
 * admin signup handler
 */
const adminSignup = (email, password, confirmPassword) => __awaiter(void 0, void 0, void 0, function* () {
    let newUser;
    try {
        if (confirmPassword != password)
            throw utils_1.helper.buildError("Password and confirm must be same", 400);
        let superAdmin = yield models_1.adminModel.findOne({ role: interfaces_1.UserRole.SUPER_ADMIN });
        if (superAdmin)
            throw utils_1.helper.buildError("Super admin already exists.", 401);
        const user = yield models_1.adminModel.findOne({ email });
        if (user) {
            const userToJson = user.toJSON();
            if (userToJson.isEmailVerified)
                throw utils_1.helper.buildError("Email already registered.", 400);
            if (!userToJson.isEmailVerified) {
                if (userToJson.expirationTime && (0, moment_1.default)(userToJson.expirationTime).isAfter((0, moment_1.default)())) {
                    throw utils_1.helper.buildError("Please verify email to registered successfully", 400);
                }
            }
        }
        // const varificationToken = randomStr.generate({ charset: "numeric", length: 4 });
        const varificationToken = utils_1.helper.getHash();
        const expirationTime = (0, moment_1.default)((0, moment_1.default)()).add(5, "minutes");
        const hashPassword = yield bcryptjs_1.default.hash(password, 12);
        const userData = {
            email,
            password: hashPassword,
            varificationToken,
            expirationTime,
            role: interfaces_1.UserRole.SUPER_ADMIN,
            isActive: true,
        };
        if (!user)
            newUser = yield models_1.adminModel.create(userData);
        else
            newUser = yield user.set(userData).save();
        // send email
        // await helper.sendOTP(
        //   userData.mobileNumber,
        //   `From ${varificationToken} Webmobril`
        // );
        return { url: `${process.env.BASE_URL}/api/v1/auth/verify-admin-email/${varificationToken}` };
    }
    catch (error) {
        if (newUser)
            yield newUser.remove();
        throw error;
    }
});
/**
 * vendor login handler
 */
const vendorLogin = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield models_1.vendorModel.findOne({ email });
        if (!user)
            throw utils_1.helper.buildError("No vendor found with this email", 404);
        const userToJson = user.toJSON();
        if (userToJson.isApproved !== interfaces_1.ApprovalStatus.APPROVED)
            throw utils_1.helper.buildError("Your account is under verification", 400);
        const isValidPassword = yield bcryptjs_1.default.compare(password, userToJson.password);
        if (!isValidPassword)
            throw utils_1.helper.buildError("Incorrect password", 400);
        const token = buildAuthToken(userToJson._id, userToJson.email, userToJson.mobileNumber);
        return Object.assign({ token }, userToJson);
    }
    catch (error) {
        throw error;
    }
});
/**
 * vendor signup handler
 */
const vendorSignup = (email, password, confirmPassword) => __awaiter(void 0, void 0, void 0, function* () {
    let newUser;
    try {
        if (confirmPassword != password)
            throw utils_1.helper.buildError("Password and confirm must be same", 400);
        const user = yield models_1.vendorModel.findOne({ email });
        if (user) {
            const userToJson = user.toJSON();
            if (userToJson.isEmailVerified)
                throw utils_1.helper.buildError("Email already registered.", 400);
            if (!userToJson.isEmailVerified) {
                if (userToJson.expirationTime && (0, moment_1.default)(userToJson.expirationTime).isAfter((0, moment_1.default)())) {
                    throw utils_1.helper.buildError("Please verify email to registered successfully", 400);
                }
            }
        }
        // const varificationToken = randomStr.generate({ charset: "numeric", length: 4 });
        const varificationToken = utils_1.helper.getHash();
        const expirationTime = (0, moment_1.default)((0, moment_1.default)()).add(5, "minutes");
        const hashPassword = yield bcryptjs_1.default.hash(password, 12);
        const userData = { email, password: hashPassword, varificationToken, expirationTime, role: interfaces_1.UserRole.SUPER_ADMIN };
        if (!user)
            newUser = yield models_1.vendorModel.create(userData);
        else
            newUser = yield user.set(userData).save();
        // send email
        // await helper.sendOTP(
        //   userData.mobileNumber,
        //   `From ${varificationToken} Webmobril`
        // );
        return { url: `${process.env.BASE_URL}/api/v1/auth/verify-vendor-email/${varificationToken}` };
    }
    catch (error) {
        if (newUser)
            yield newUser.remove();
        throw error;
    }
});
/**
 * verify admin email handler
 */
const verifyAdminEmail = (varificationToken) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield models_1.adminModel.findOne({ varificationToken });
        if (!user)
            throw utils_1.helper.buildError("Please enter valid varification token", 400);
        const userToJson = user.toJSON();
        if (userToJson.expirationTime && (0, moment_1.default)(userToJson.expirationTime).isBefore((0, moment_1.default)()))
            throw utils_1.helper.buildError("Link expired", 400);
        let data = { varificationToken: null, expirationTime: null, isEmailVerified: true };
        if (userToJson.role == interfaces_1.UserRole.SUPER_ADMIN)
            data.isApproved = interfaces_1.ApprovalStatus.APPROVED;
        yield user.set(data).save();
    }
    catch (error) {
        throw error;
    }
});
/**
 * resend admin email handler
 */
const resendAdminEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield models_1.adminModel.findOne({ email });
        if (!user)
            throw utils_1.helper.buildError("No user found with this email", 400);
        const userToJson = user.toJSON();
        if (userToJson.isEmailVerified)
            throw utils_1.helper.buildError("Your email already verified", 400);
        if (userToJson.expirationTime && (0, moment_1.default)(userToJson.expirationTime).isAfter((0, moment_1.default)()))
            throw utils_1.helper.buildError("Email link has been already sent", 400);
        // const varificationToken = randomStr.generate({ charset: "numeric", length: 4 });
        const varificationToken = utils_1.helper.getHash();
        const expirationTime = (0, moment_1.default)((0, moment_1.default)()).add(5, "minutes");
        yield user.set({ varificationToken, expirationTime }).save();
        // send email
        // await emailHandler.sentSignUpMail(userToJson, varificationToken);
        return { url: `${process.env.BASE_URL}/api/v1/auth/verify-email/${varificationToken}` };
    }
    catch (error) {
        throw error;
    }
});
/**
 * verify vendor email handler
 */
const verifyVendorEmail = (varificationToken) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield models_1.vendorModel.findOne({ varificationToken });
        if (!user)
            throw utils_1.helper.buildError("Please enter valid varification token", 400);
        const userToJson = user.toJSON();
        if (userToJson.expirationTime && (0, moment_1.default)(userToJson.expirationTime).isBefore((0, moment_1.default)()))
            throw utils_1.helper.buildError("Link expired", 400);
        let data = { varificationToken: null, expirationTime: null, isEmailVerified: true };
        yield user.set(data).save();
    }
    catch (error) {
        throw error;
    }
});
/**
 * resend vendor email handler
 */
const resendVendorEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield models_1.vendorModel.findOne({ email });
        if (!user)
            throw utils_1.helper.buildError("No user found with this email", 400);
        const userToJson = user.toJSON();
        if (userToJson.isEmailVerified)
            throw utils_1.helper.buildError("Your email already verified", 400);
        if (userToJson.expirationTime && (0, moment_1.default)(userToJson.expirationTime).isAfter((0, moment_1.default)()))
            throw utils_1.helper.buildError("Email link has been already sent", 400);
        // const varificationToken = randomStr.generate({ charset: "numeric", length: 4 });
        const varificationToken = utils_1.helper.getHash();
        const expirationTime = (0, moment_1.default)((0, moment_1.default)()).add(5, "minutes");
        yield user.set({ varificationToken, expirationTime }).save();
        // send email
        // await emailHandler.sentSignUpMail(userToJson, varificationToken);
        return { url: `${process.env.BASE_URL}/api/v1/auth/verify-email/${varificationToken}` };
    }
    catch (error) {
        throw error;
    }
});
/**
 * verify auth token is valid
 */
const verifyAuthToken = (token, role) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let authData = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        if (!authData)
            return false;
        const model = role == interfaces_1.UserRole.VENDOR ? models_1.vendorModel : role == interfaces_1.UserRole.USER ? models_1.userModel : models_1.adminModel;
        const authUser = yield model.findOne({ _id: authData.id });
        if (!authUser)
            return false;
        return true;
    }
    catch (error) {
        return false;
    }
});
/**
 * get auth user account details
 */
const getMyInfo = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let info = req.user.toJSON();
        delete info.password;
        return info;
    }
    catch (error) {
        throw error;
    }
});
const changePassword = (req, data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { oldPassword, newPassword, confirmPassword } = data;
        if (newPassword != confirmPassword)
            throw utils_1.helper.buildError("New password and confirm password must be same.", 422);
        let iUser = req.user;
        let userObj = req.user.toJSON();
        const isMatch = yield bcryptjs_1.default.compare(oldPassword, userObj.password);
        if (!isMatch)
            throw utils_1.helper.buildError("incorrect old password", 422);
        let newHashPass = yield bcryptjs_1.default.hash(newPassword, 12);
        yield iUser.set({ password: newHashPass }).save();
    }
    catch (error) {
        throw error;
    }
});
/**
 * send admin forgot password email
 */
const sendAdminForgotPasswordEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let conditions = { email };
        let user = yield models_1.adminModel.findOne(conditions);
        if (!user)
            throw utils_1.helper.buildError("no admin found with this email", 400);
        const userObj = user.toJSON();
        if (userObj.expirationTime && (0, moment_1.default)(userObj.expirationTime).isAfter((0, moment_1.default)())) {
            const url = `${process.env.BASE_URL}/admin-reset-password/${userObj.varificationToken}`;
            let leftMinutes = (0, moment_1.default)(userObj.expirationTime).subtract((0, moment_1.default)().minutes(), "minutes").minutes();
            throw utils_1.helper.buildError(`Please enter old otp sent to your mobile, or wait ${leftMinutes} min till old otp expire.`, 200, url);
        }
        const varificationToken = utils_1.helper.getHash();
        const expirationTime = (0, moment_1.default)().add(1, "hour");
        yield user.set({ varificationToken, expirationTime, VerificationType: interfaces_1.VerificationType.ForgotPassword }).save();
        let url = yield utils_1.emailHandler.sentForgotPasswordEmail(userObj.email, varificationToken, "admin-reset-password");
        return url;
    }
    catch (error) {
        throw error;
    }
});
/**
 * reset admin password
 */
const resetAdminPassword = (varificationToken, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let admin = yield models_1.adminModel.findOne({ varificationToken });
        if (!admin)
            throw utils_1.helper.buildError("invalid token", 400);
        let adminObj = admin.toJSON();
        if (adminObj.expirationTime && (0, moment_1.default)(adminObj.expirationTime).isSameOrBefore((0, moment_1.default)()))
            throw utils_1.helper.buildError("link expired, Please resend again", 400);
        const isEqual = yield bcryptjs_1.default.compare(newPassword, adminObj.password);
        if (isEqual)
            throw utils_1.helper.buildError("don't use your old password", 400);
        let password = yield bcryptjs_1.default.hash(newPassword, +process.env.JWT_SALT);
        yield admin.set({ password, varificationToken: null, expirationTime: null, VerificationType: null }).save();
    }
    catch (error) {
        throw error;
    }
});
/**
 * send vendor forgot password email
 */
const sendVendorForgotPasswordEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let conditions = { email };
        let user = yield models_1.vendorModel.findOne(conditions);
        if (!user)
            throw utils_1.helper.buildError("no user found with user email", 400);
        const userObj = user.toJSON();
        if (userObj.expirationTime && (0, moment_1.default)(userObj.expirationTime).isAfter((0, moment_1.default)())) {
            const url = `${process.env.BASE_URL}/vendor-reset-password/${userObj.varificationToken}`;
            let leftMinutes = (0, moment_1.default)(userObj.expirationTime).subtract((0, moment_1.default)().minutes(), "minutes").minutes();
            throw utils_1.helper.buildError(`Please enter old otp sent to your mobile, or wait ${leftMinutes} min till old otp expire.`, 200, url);
        }
        const varificationToken = utils_1.helper.getHash();
        const expirationTime = (0, moment_1.default)().add(1, "hour");
        yield user.set({ varificationToken, expirationTime, VerificationType: interfaces_1.VerificationType.ForgotPassword }).save();
        let url = yield utils_1.emailHandler.sentForgotPasswordEmail(userObj.email, varificationToken, "vendor-reset-password");
        return url;
    }
    catch (error) {
        throw error;
    }
});
/**
 * reset vendor password
 */
const resetVendorPassword = (varificationToken, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let admin = yield models_1.vendorModel.findOne({ varificationToken });
        if (!admin)
            throw utils_1.helper.buildError("invalid token", 400);
        let adminObj = admin.toJSON();
        if (adminObj.expirationTime && (0, moment_1.default)(adminObj.expirationTime).isSameOrBefore((0, moment_1.default)()))
            throw utils_1.helper.buildError("link expired, Please resend again", 400);
        const isEqual = yield bcryptjs_1.default.compare(newPassword, adminObj.password);
        if (isEqual)
            throw utils_1.helper.buildError("don't use your old password", 400);
        let password = yield bcryptjs_1.default.hash(newPassword, +process.env.JWT_SALT);
        yield admin.set({ password, varificationToken: null, expirationTime: null, VerificationType: null }).save();
    }
    catch (error) {
        throw error;
    }
});
exports.default = {
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
