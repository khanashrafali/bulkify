import moment from "moment";
import { body, CustomValidator, param, query } from "express-validator";
import { couponModel } from "../../models";
import { CONSTANT, helper } from "../../utils";

const checkDuplicateCode: CustomValidator = async (val, { req }) => {
  let conditions: any = { code: val };
  if (req.params?.couponId) conditions._id = { $ne: req.params?.couponId };
  const coupon = await couponModel.findOne(conditions);
  if (coupon) throw helper.buildError("Same coupon code already exists", 400);
};

const checkStartEndDate: CustomValidator = async (val, { req }) => {
  if (!req.params?.couponId && moment(req.body.startDate).isBefore(moment(), "date")) {
    throw helper.buildError("Start date should be greater or equal to current Date", 400);
  }

  if (moment(val).isBefore(req.body.startDate, "date")) {
    throw helper.buildError("Start date should be less then end date", 400);
  }
};

const postAddCoupon = [
  body("code", "Please enter valid code")
    .exists()
    .trim()
    .notEmpty()
    .isLength({ max: 20 })
    .withMessage("Code should be less or equal to 20 character")
    .custom(checkDuplicateCode),
  body("discountInPercent", "Please enter valid discountInPercent").exists().isFloat({ gt: 0, lt: 101 }),
  body("startDate", "Please enter valid startDate").exists().isDate({ format: CONSTANT.DATE }),
  body("endDate", "Please enter valid endDate").exists().isDate({ format: CONSTANT.DATE }).custom(checkStartEndDate),
  body("numberOfUsers", "Please enter valid numberOfUsers").exists().isInt({ gt: 0 }),
  body("isPrivate", "Please enter valid isPrivate").exists().isBoolean(),
];

const putUpdateCoupon = [param("couponId", "Please enter valid couponId").exists().isMongoId(), ...postAddCoupon];

const patchUpdateCouponStatus = [
  param("couponId", "Please enter valid couponId").exists().isMongoId(),
  body("isPrivate", "Please enter valid isPrivate").exists().trim().notEmpty(),
];

const deleteCoupon = [param("couponId", "Please enter valid couponId").exists().isMongoId()];

const getCoupon = [param("couponId", "Please enter valid couponId").exists().isMongoId()];

const getCoupons = [
  query("endDate", "Please enter valid endDate").optional().isDate({ format: CONSTANT.DATE }),
  query("startDate", "Please enter valid startDate").optional().isDate({ format: CONSTANT.DATE }),
  query("discountInPercent", "Please enter valid discountInPercent").optional().toInt(),
  query("numberOfUsers", "Please enter valid numberOfUsers").optional().toInt(),
  query("createdAt", "Please enter valid createdAt").optional().isDate({ format: CONSTANT.DATE }),
  query("status", "Please enter valid status").optional().isIn(["true", "false"]).toBoolean(),
  query("page", "Please enter valid page").optional().toInt().isInt({ gt: 0 }),
  query("pageSize", "Please enter valid pageSize").optional().toInt().isInt({ gt: 0 }),
];

export default {
  postAddCoupon,
  putUpdateCoupon,
  patchUpdateCouponStatus,
  deleteCoupon,
  getCoupon,
  getCoupons,
};
