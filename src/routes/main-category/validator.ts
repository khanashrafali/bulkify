import { body, CustomValidator, param, query } from "express-validator";
import { mainCategoryModel } from "../../models";
import { CONSTANT, helper } from "../../utils";

// sub category validations

const checkDuplicateMainCategory: CustomValidator = async (val, { req }) => {
  let conditions: any = { name: { $regex: helper.regxEscape(val), $options: "i" } };
  if (req.params?.categoryId) conditions._id = { $ne: req.params?.categoryId };
  const category = await mainCategoryModel.findOne(conditions);
  if (category) throw helper.buildError("Same category name already exists", 400);
};

// main category validations

const postCreateMainCategory = [
  body("name", "Please enter valid name")
    .exists()
    .trim()
    .notEmpty()
    .custom(checkDuplicateMainCategory),
  body("image", "Please enter valid image").optional().isURL(),
];

const putUpdateMainCategory = [
  param("categoryId", "Please enter valid category Id").exists().isMongoId(),
  body("name", "Please enter valid name")
    .exists()
    .trim()
    .notEmpty()
    .custom(checkDuplicateMainCategory),
  body("image", "Please enter valid image").optional().isURL(),
];

const getMainCategory = [
  param("categoryId", "Please enter valid category Id").exists().isMongoId(),
];

const getMainCategories: any[] = [
  query("createdAt", "Please enter valid createdAt").optional().isDate({
    format: CONSTANT.DATE,
  }),
  query("status", "Please enter valid status").optional().isIn(["true", "false"]).toBoolean(),
  query("page", "Please enter valid page").optional().toInt().isInt({ gt: 0 }),
  query("pageSize", "Please enter valid pageSize").optional().toInt().isInt({ gt: 0 }),
];

const deleteMainCategory = [
  param("categoryId", "Please enter valid category Id").exists().isMongoId(),
];

const patchUpdateCategoryStatus: any[] = [
  param("categoryId", "Please enter valid category Id").exists().isMongoId(),
  body("status", "Please enter valid status").exists().isBoolean(),
];

export default {
  postCreateMainCategory,
  putUpdateMainCategory,
  getMainCategory,
  getMainCategories,
  deleteMainCategory,
  patchUpdateCategoryStatus,
};
