import { body, CustomValidator, param, query } from "express-validator";
import { userModel } from "../../models";
import { CONSTANT, helper } from "../../utils";
import { IRequest } from "../../utils/interfaces";

const checkEmail: CustomValidator = async (val, { req }) => {
  let iReq = req as IRequest;
  let userObj: any = iReq.user.toJSON();
  let user = await userModel.findOne({ _id: { $ne: userObj._id }, email: val });
  if (user) throw helper.buildError("Email already taken", 400);
};

const checkMobile: CustomValidator = async (val, { req }) => {
  let iReq = req as IRequest;
  let userObj: any = iReq.user.toJSON();
  let user = await userModel.findOne({ _id: { $ne: userObj._id }, mobileNumber: val });
  if (user) throw helper.buildError("Mobile Number already taken", 400);
};

const getUsers = [
  query("createdAt", "Please enter valid createdAt").optional().isDate({ format: CONSTANT.DATE }),
  query("page", "Please enter valid page").optional().toInt().isInt({ gt: 0 }),
  query("pageSize", "Please enter valid pageSize").optional().toInt().isInt({ gt: 0 }),
];

const postSubscribe = [body("email", "Please enter valid email").exists().notEmpty().isEmail().normalizeEmail()];

const updateStatus = [
  param("userId", "Please enter valid userId").exists().isMongoId(),
  body("status", "Please enter valid status").exists().isBoolean(),
];

const updateProfile = [
  body("email", "Please enter valid email").exists().trim().notEmpty().isEmail().normalizeEmail().custom(checkEmail),
  body("name", "Please enter valid name")
    .exists()
    .trim()
    .notEmpty()
    .isLength({ max: 100 })
    .withMessage("Length must be less then 100")
    .isAlpha("en-IN", { ignore: [".", " ", "_"] }),
  body("mobileNumber", "Please enter valid mobileNumber")
    .exists()
    .trim()
    .notEmpty()
    .isMobilePhone("en-IN")
    .custom(checkMobile),
  body("dob", "Please enter valid dob").optional().trim().notEmpty().isDate({
    format: CONSTANT.DATE,
  }),
];

const postUserFeedback = [
  body("email", "Please enter valid email").exists().isEmail().normalizeEmail(),
  body("name", "Please enter valid name").exists().trim().notEmpty(),
  body("phone", "Please enter valid phone").exists().isMobilePhone("en-IN"),
];

export default {
  getUsers,
  postSubscribe,
  updateStatus,
  updateProfile,
  postUserFeedback,
};
