import { body, CustomValidator, oneOf, param, query } from "express-validator";
import { CONSTANT, helper } from "../../utils";
import { variantModel } from "../../models";
import { UserRole } from "../../utils/interfaces";
import moment from "moment";
const allowedRoles = CONSTANT.USER_ROLES.filter((v) => v != UserRole.ADMIN);

const checkVariantName: CustomValidator = async (val, { req }) => {
  let variantId = req.params?.variantId;
  let conditions: any = { variantName: { $regex: helper.regxEscape(val), $options: "i" } };
  if (variantId) conditions._id = { $ne: variantId };
  let v = await variantModel.findOne(conditions);
  if (v) throw helper.buildError("same variant already exists", 400);
};

const getVariant: any[] = [param("variantId", "Please enter valid variantId").exists().isMongoId()];

const addVariant: any[] = [
  body("status", "Please enter valid status").exists().isBoolean().toBoolean(),
  body("categories", "Please enter valid categories").exists().isArray({ min: 1 }),
  body("categories.*", "Please enter valid category").exists().isMongoId(),
  body("variantName", "Please enter valid variantName").exists().trim().notEmpty().custom(checkVariantName),
  body("variantDescription", "Please enter valid variantDescription").exists().trim(),
  body("values", "Please enter valid values").exists().isArray({ min: 1 }),
  body("values.*", "Please enter valid value's value").exists().trim().notEmpty(),
];

const updateVariant: any[] = [...getVariant, ...addVariant];
const deleteVariant: any[] = [...getVariant];
const getVariants: any[] = [
  query("status", "Please enter valid status").optional().toBoolean(),
  query("category", "Please enter valid category").optional().isMongoId(),
];
const updateVariantStatus = [
  ...getVariant,
  body("status", "Please enter valid status").exists().isBoolean().toBoolean(),
];

export default {
  addVariant,
  updateVariant,
  getVariant,
  deleteVariant,
  getVariants,
  updateVariantStatus,
};
