import { body, CustomValidator, param, query } from "express-validator";
import { categoryModel } from "../../models";
import { CONSTANT, helper } from "../../utils";

// sub category validations

const checkDuplicateMainCategory: CustomValidator = async (val, { req }) => {
  let conditions: any = { name: { $regex: helper.regxEscape(val), $options: "i" }, level: 0 };
  if (req.params?.mainCategoryId) conditions._id = { $ne: req.params?.mainCategoryId };
  const category = await categoryModel.findOne(conditions);
  if (category) throw helper.buildError("Same category name already exists", 400);
};

const checkDuplicateSubCategory: CustomValidator = async (val, { req }) => {
  let mainCat: any = await categoryModel.findOne({ _id: req.params?.mainCategoryId }).populate({
    path: "subCategories",
    match: { name: { $regex: helper.regxEscape(val), $options: "i" } },
  });

  if (!mainCat) throw helper.buildError("No category found with this id", 400);
  if (mainCat?.subCategories?.length) throw helper.buildError("Same sub category name already exists", 400);
};

const checkDuplicateSubCategoryOnUpdate: CustomValidator = async (val, { req }) => {
  let mainCat: any = await categoryModel.findOne({ _id: req.params?.categoryId }).populate({
    path: "subCategories",
    match: {
      _id: { $ne: req.body?.subCategoryId },
      name: { $regex: helper.regxEscape(val), $options: "i" },
    },
  });

  if (!mainCat) throw helper.buildError("No category found with this id", 400);
  if (mainCat?.subCategories?.length) throw helper.buildError("Same sub category name already exists", 400);
};

const postCreateSubCategory = [
  param("mainCategoryId", "Please enter valid main category id").exists().isMongoId(),
  body("name", "Please enter valid name").exists().trim().notEmpty().custom(checkDuplicateSubCategory),
  body("image", "Please enter valid image").optional().isObject(),
  body("collectionIds", "Please enter valid collectionIds").optional({ checkFalsy: true }).isArray(),
  body("collectionIds.*", "Please enter valid collectionIds").optional({ checkFalsy: true }).isMongoId(),
];

const putUpdateSubCategory = [
  param("categoryId", "Please enter valid category Id").exists().isMongoId(),
  body("subCategoryId", "Please enter valid category Id").exists().isMongoId(),
  body("image", "Please enter valid image").optional().isObject(),
  body("name", "Please enter valid name").exists().trim().notEmpty().custom(checkDuplicateSubCategoryOnUpdate),
  body("collectionIds", "Please enter valid collectionIds").optional({ checkFalsy: true }).isArray(),
  body("collectionIds.*", "Please enter valid collectionIds").optional({ checkFalsy: true }).isMongoId(),
];

const getSubCategory = [param("subCategoryId", "Please enter valid category Id").exists().isMongoId()];

const getSubCategories = [param("mainCategoryId", "Please enter valid category Id").exists().isMongoId()];

const deleteSubCategory = [param("subCategoryId", "Please enter valid category Id").exists().isMongoId()];

// main category validations

const postCreateMainCategory = [
  body("name", "Please enter valid name").exists().trim().notEmpty().custom(checkDuplicateMainCategory),
  body("image", "Please enter valid image").optional().isObject(),
];

const putUpdateMainCategory = [
  param("mainCategoryId", "Please enter valid category Id").exists().isMongoId(),
  body("name", "Please enter valid name").exists().trim().notEmpty().custom(checkDuplicateMainCategory),
  body("image", "Please enter valid image").optional().isObject(),
];

const getMainCategory = [param("mainCategoryId", "Please enter valid category Id").exists().isMongoId()];

const getMainCategories: any[] = [
  query("createdAt", "Please enter valid createdAt").optional().isDate({
    format: CONSTANT.DATE,
  }),
  query("status", "Please enter valid status").optional().isIn(["true", "false"]).toBoolean(),
  query("page", "Please enter valid page").optional().toInt().isInt({ gt: 0 }),
  query("pageSize", "Please enter valid pageSize").optional().toInt().isInt({ gt: 0 }),
];

const deleteMainCategory = [param("mainCategoryId", "Please enter valid category Id").exists().isMongoId()];

const patchUpdateCategoryStatus: any[] = [
  param("categoryId", "Please enter valid category Id").exists().isMongoId(),
  body("status", "Please enter valid status").exists().isBoolean(),
];

export default {
  postCreateSubCategory,
  postCreateMainCategory,
  putUpdateMainCategory,
  getMainCategory,
  getMainCategories,
  deleteMainCategory,
  putUpdateSubCategory,
  getSubCategory,
  getSubCategories,
  deleteSubCategory,
  patchUpdateCategoryStatus,
};
