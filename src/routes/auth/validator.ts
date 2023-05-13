import { body, oneOf, param, query } from "express-validator";
import { CONSTANT, helper } from "../../utils";

const userLogin: any[] = [
  oneOf(
    [
      body("emailOrMobile").exists().trim().notEmpty().isMobilePhone("en-IN"),
      body("emailOrMobile").exists().trim().notEmpty().isEmail().normalizeEmail(),
    ],
    "Please enter valid mobile number or email id"
  ),
];

const userSignup: any[] = [
  body("name", "Please enter valid name")
    .exists()
    .trim()
    .notEmpty()
    .isAlpha("en-IN", { ignore: [" ", "."] }),
  oneOf(
    [
      body("emailOrMobile").exists().trim().notEmpty().isMobilePhone("en-IN"),
      body("emailOrMobile").exists().trim().notEmpty().isEmail().normalizeEmail(),
    ],
    "Please enter valid mobile number or email id"
  ),
];

const vendorSignup: any[] = [
  body("email", "Please enter valid email").exists().trim().notEmpty().isEmail().normalizeEmail(),
  body("password", `Password must be at least 8 digits and it should have 1 uppercase, 1 lowercase, 1 number and 1 special character`)
    .exists()
    .trim()
    .notEmpty()
    .matches(CONSTANT.REGX.Password),
];

const resendOtp = [
  oneOf(
    [
      body("emailOrMobile").exists().trim().notEmpty().isMobilePhone("en-IN"),
      body("emailOrMobile").exists().trim().notEmpty().isEmail().normalizeEmail(),
    ],
    "Please enter valid mobile number or email id"
  ),
];

const verifyOtp = [
  oneOf(
    [
      body("emailOrMobile").exists().trim().notEmpty().isMobilePhone("en-IN"),
      body("emailOrMobile").exists().trim().notEmpty().isEmail().normalizeEmail(),
    ],
    "Please enter valid mobile number or email id"
  ),
  body("otp", "Please enter valid otp").exists().trim().notEmpty(),
];

const adminSignup = [
  body("email", "Please enter valid email").exists().trim().notEmpty().isEmail().normalizeEmail(),
  body("password", `Password must be at least 8 digits and it should have 1 uppercase, 1 lowercase, 1 number and 1 special character`)
    .exists()
    .trim()
    .notEmpty()
    .matches(CONSTANT.REGX.Password),
];

const resendAdminEmail = [body("email", "Please enter valid email").exists().trim().notEmpty().isEmail().normalizeEmail()];

const verifyAdminEmail = [param("token", "Please enter valid token").exists().trim().notEmpty()];

const resendVendorEmail = [body("email", "Please enter valid email").exists().trim().notEmpty().isEmail().normalizeEmail()];

const verifyVendorEmail = [param("token", "Please enter valid token").exists().trim().notEmpty()];

const adminLogin = [
  body("email", "Please enter valid email").exists().trim().notEmpty().isEmail().normalizeEmail(),
  body("password", `Please enter valid password`).exists().trim().notEmpty(),
];

const getValidateToken = [
  query("token", "Please enter valid token").exists().trim().notEmpty(),
  query("role", `Please enter valid role like ${CONSTANT.USER_ROLES.join(", ")}`).isIn(CONSTANT.USER_ROLES),
];

const vendorLogin = [
  body("email", "Please enter valid email").exists().trim().notEmpty().isEmail().normalizeEmail(),
  body("password", `Please enter valid password`).exists().trim().notEmpty(),
];

const changePassword = [
  body("oldPassword", "Please enter valid oldPassword").exists(),
  body("newPassword", `Password must be at least 8 digits and it should have 1 uppercase, 1 lowercase, 1 number and 1 special character`)
    .exists()
    .trim()
    .notEmpty()
    .matches(CONSTANT.REGX.Password),
  body("confirmPassword", "Please enter valid confirmPassword").exists().trim().notEmpty(),
];

const postReplacePassword = [
  body("newPassword", `Password must be at least 8 digits and it should have 1 uppercase, 1 lowercase, 1 number and 1 special character`)
    .exists()
    .trim()
    .notEmpty()
    .matches(CONSTANT.REGX.Password)
    .isLength({ max: 20 })
    .withMessage("password length must be less then 20"),
  body("confirmPassword", "Please enter valid confirm confirmPassword")
    .exists()
    .trim()
    .notEmpty()
    .custom(async (val, { req }) => {
      if (val !== req.body.newPassword) throw helper.buildError("must match new Password and confirm password", 400);
    }),
];

const putResetAdminPassword = [param("token", "Please enter valid token").exists().trim().notEmpty(), ...postReplacePassword];
const postSendAdminForgotPasswordMail = [...resendAdminEmail];
const putResetVendorPassword = [param("token", "Please enter valid token").exists().trim().notEmpty(), ...postReplacePassword];
const postSendVendorForgotPasswordMail = [...resendAdminEmail];

export default {
  userLogin,
  userSignup,
  resendOtp,
  verifyOtp,
  vendorLogin,
  vendorSignup,
  adminLogin,
  adminSignup,
  resendAdminEmail,
  verifyAdminEmail,
  resendVendorEmail,
  verifyVendorEmail,
  getValidateToken,
  changePassword,
  putResetAdminPassword,
  postSendAdminForgotPasswordMail,
  putResetVendorPassword,
  postSendVendorForgotPasswordMail,
};
