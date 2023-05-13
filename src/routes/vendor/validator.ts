import { body, CustomValidator, oneOf, param, query } from "express-validator";
import { vendorModel } from "../../models";
import { CONSTANT, helper } from "../../utils";

const checkDuplicateVendorbuesnessName: CustomValidator = async (val, { req }) => {
  let conditions: any = {
    businessName: { $regex: new RegExp(`^${helper.regxEscape(val)}$`), $options: "i" },
  };

  if (req.params?.vendorId) conditions._id = { $ne: req.params?.vendorId };
  const vendor = await vendorModel.findOne(conditions);
  if (vendor) throw helper.buildError("Same vendor Business Name already exists", 400);
};

const checkDuplicateVendorMobileNumber: CustomValidator = async (val, { req }) => {
  let conditions: any = { mobileNumber: val };
  if (req.params?.vendorId) conditions._id = { $ne: req.params?.vendorId };
  const vendor = await vendorModel.findOne(conditions);
  if (vendor) throw helper.buildError("Same vendor mobile number already exists", 400);
};

const checkDuplicateVendorEmail: CustomValidator = async (val, { req }) => {
  let conditions: any = { email: val };
  if (req.params?.vendorId) conditions._id = { $ne: req.params?.vendorId };
  const vendor = await vendorModel.findOne(conditions);
  if (vendor) throw helper.buildError("Same vendor email already exists", 400);
};

const becameAVendor = [
  body("gstNumber", "Please enter valid gst number.").optional({ checkFalsy: true }).trim().matches(CONSTANT.REGX.GST),
  body("panNumber", "Please enter valid pan number.").optional({ checkFalsy: true }).trim().matches(CONSTANT.REGX.PAN),
  body("address", "Please enter valid address").exists().trim().notEmpty(),
  body("mobileNumber", "Please enter valid mobileNumber")
    .exists()
    .trim()
    .notEmpty()
    .isMobilePhone("en-IN")
    .custom(checkDuplicateVendorMobileNumber),
  body("name", "Please enter valid name").exists().trim().notEmpty(),
  body("email", "Please enter valid email")
    .exists()
    .trim()
    .isEmail()
    .normalizeEmail()
    .custom(checkDuplicateVendorEmail),
  body("businessType", "Please enter valid business type").exists().trim().notEmpty(),
  body("accountHolderName", "Please enter valid accountHolderName").exists().trim().notEmpty(),
  body("ifscCode", "Please enter valid ifscCode").exists().trim().notEmpty(),
  body("bankName", "Please enter valid bankName").exists().trim().notEmpty(),
  body("accountNumber", "Please enter valid accountNumber").exists().trim().notEmpty(),
];

const completeVendorProfile: any[] = [...becameAVendor];

const addVendor: any[] = [...becameAVendor];

const updateVendor: any[] = [
  param("vendorId", "Please enter valid vendorId").exists().isMongoId(),
  body("gstNumber", "Please enter valid gst number.").optional({ checkFalsy: true }).trim().matches(CONSTANT.REGX.GST),
  body("panNumber", "Please enter valid pan number.").optional({ checkFalsy: true }).trim().matches(CONSTANT.REGX.PAN),
  body("address", "Please enter valid address").exists().trim().notEmpty(),
  body("mobileNumber", "Please enter valid mobileNumber")
    .exists()
    .trim()
    .notEmpty()
    .isMobilePhone("en-IN")
    .custom(checkDuplicateVendorMobileNumber),
  body("name", "Please enter valid name").exists().trim().notEmpty(),
  body("email", "Please enter valid email")
    .exists()
    .trim()
    .isEmail()
    .normalizeEmail()
    .custom(checkDuplicateVendorEmail),
  body("avatar", "Please enter valid avatar").exists().isURL(),
  body("images", "Please enter valid images").exists().isArray(),
  body("images.*", "Please enter valid image").exists().isURL(),
  body("video", "Please enter valid video").exists().isURL(),
  body("businessType", "Please enter valid business type").exists().trim().notEmpty(),
  body("bankDetails.accountHolderName", "Please enter valid accountHolderName").exists().trim().notEmpty(),
  body("bankDetails.ifscCode", "Please enter valid ifscCode").exists().trim().notEmpty(),
  body("bankDetails.bankName", "Please enter valid bankName").exists().trim().notEmpty(),
  body("bankDetails.accountNumber", "Please enter valid accountNumber").exists().trim().notEmpty(),
];

const getVendor = [param("vendorId", "Please enter valid vendorId").exists().isMongoId()];

const getVendors = [
  query("isApproved", `Please enter valid ${CONSTANT.APPROVAL_STATUS.join(",")}`)
    .optional()
    .isIn(CONSTANT.APPROVAL_STATUS),
  query("isVendorProfileComplete", "Please enter valid isVendorProfileComplete like true,false")
    .optional()
    .isIn(["true", "false"])
    .toBoolean(),
  query("createdAt", "Please enter valid createdAt").optional().isDate({
    format: CONSTANT.DATE,
  }),
  query("isActive", "Please enter valid isActive  ").optional().isIn(["true", "false"]).toBoolean(),
  query("page", "Please enter valid page").optional().toInt().isInt({ gt: 0 }),
  query("pageSize", "Please enter valid pageSize").optional().toInt().isInt({ gt: 0 }),
];

const updateVendorStatus = [
  param("vendorId", "Please enter valid vendorId").exists().isMongoId(),
  body("status", "Please enter valid isActive like true, false").exists().isBoolean(),
];

const patchUpdateApproval = [
  param("vendorId", "Please enter valid vendorId").exists().isMongoId(),
  body("isApproved", `Please enter valid status like ${CONSTANT.APPROVAL_STATUS.join(", ")}`)
    .exists()
    .isIn(CONSTANT.APPROVAL_STATUS),
];

const updateVendorProfile = [
  ...becameAVendor,
  body("avatar", "Please enter valid avatar").exists().isURL(),
  body("video", "Please enter valid video").exists().isURL(),
  body("images", "Please enter valid images").exists().isArray({ min: 1 }),
  body("images.*", "Please enter valid image").exists().isURL(),
];

export default {
  completeVendorProfile,
  addVendor,
  getVendor,
  getVendors,
  updateVendor,
  becameAVendor,
  updateVendorStatus,
  patchUpdateApproval,
  updateVendorProfile,
};
