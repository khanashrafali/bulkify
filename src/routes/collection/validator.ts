import { body, CustomValidator, param, query } from "express-validator";
import { collectionModel } from "../../models";
import { CONSTANT, helper } from "../../utils";

const checkDuplicateCollection: CustomValidator = async (val, { req }) => {
  let conditions: any = {
    title: { $regex: new RegExp(`^${helper.regxEscape(val)}$`), $options: "i" },
  };

  if (req.params?.collectionId) conditions._id = { $ne: req.params?.collectionId };
  const collection = await collectionModel.findOne(conditions);
  if (collection) throw helper.buildError("same collection already exists", 400);
};

const postAddCollection = [
  body("chartImage", "Please enter valid chartImage").optional({ nullable: true }).isURL(),
  body("image", "Please enter valid image").exists().isURL(),
  body("title", "Please enter valid title").exists({ checkFalsy: false }).trim().notEmpty().custom(checkDuplicateCollection),
  body("description", "Please enter valid description").exists({ checkFalsy: false }).trim(),
  body("mustMatchAll", "Please enter valid mustMatchAll").exists({ checkFalsy: false }).isBoolean(),
  body("conditions", "Please enter valid conditions").exists({ checkFalsy: false }).isArray({ min: 1 }),
  body("conditions.*.field", `Please enter valid field of conditions like ${CONSTANT.PRODUCT_FIELDS.map((e) => e.key).join(", ")}`)
    .exists()
    .trim()
    .notEmpty()
    .isIn(CONSTANT.PRODUCT_FIELDS.map((e) => e.key)),
  body(
    "conditions.*.condition",
    `Please enter valid condition of conditions like ${CONSTANT.PRODUCT_CONDITION()
      .map((e) => e.key)
      .join(", ")}`
  )
    .exists()
    .trim()
    .notEmpty()
    .isIn(CONSTANT.PRODUCT_CONDITION().map((e) => e.key)),
  body("conditions.*.value", "Please enter valid value of conditions").exists().trim().notEmpty(),
];

const putUpdateCollection = [
  param("collectionId", "Please enter valid collectionId").exists().isMongoId(),
  body("chartImage", "Please enter valid chartImage").optional({ nullable: true }).isURL(),
  body("image", "Please enter valid image").exists().isURL(),
  body("title", "Please enter valid title").exists({ checkFalsy: false }).trim().notEmpty().custom(checkDuplicateCollection),
  body("description", "Please enter valid description").exists({ checkFalsy: false }).trim(),
  body("mustMatchAll", "Please enter valid mustMatchAll").exists({ checkFalsy: false }).isBoolean(),
  body("conditions", "Please enter valid conditions").exists({ checkFalsy: false }).isArray({ min: 1 }),
  body("conditions.*.field", `Please enter valid field of conditions like ${CONSTANT.PRODUCT_FIELDS.map((e) => e.key).join(", ")}`)
    .exists()
    .trim()
    .notEmpty()
    .isIn(CONSTANT.PRODUCT_FIELDS.map((e) => e.key)),
  body(
    "conditions.*.condition",
    `Please enter valid condition of conditions like ${CONSTANT.PRODUCT_CONDITION()
      .map((e) => e.key)
      .join(", ")}`
  )
    .exists()
    .trim()
    .notEmpty()
    .isIn(CONSTANT.PRODUCT_CONDITION().map((e) => e.key)),
  body("conditions.*.value", "Please enter valid value of conditions").exists().trim().notEmpty(),
];

const getCollection = [param("collectionId", "Please enter valid collectionId").exists().isMongoId()];

const deleteCollection = [param("collectionId", "Please enter valid collectionId").exists().isMongoId()];

const getCollections: any[] = [
  query("createdAt", "Please enter valid createdAt").optional().isDate({
    format: CONSTANT.DATE,
  }),
  query("status", "Please enter valid status").optional().isIn(["true", "false"]).toBoolean(),
  query("isFeatured", "Please enter valid isFeatured").optional().isIn(["true", "false"]).toBoolean(),
  query("page", "Please enter valid page").optional().toInt().isInt({ gt: 0 }),
  query("pageSize", "Please enter valid pageSize").optional().toInt().isInt({ gt: 0 }),
];

const putAttachCollections: any[] = [
  param("categoryId", "Please enter valid categoryId").exists().isMongoId(),
  body("collectionIds", "Please enter valid collectionIds").optional({ checkFalsy: true }).isArray(),
  body("collectionIds.*", "Please enter valid collection Id").optional({ checkFalsy: true }).isMongoId(),
];

const putDeattachCollection: any[] = [
  param("categoryId", "Please enter valid categoryId").exists().isMongoId(),
  body("collectionId", "Please enter valid collection Id").exists().isMongoId(),
];

const patchUpdateCollectionStatus = [
  param("collectionId", "Please enter valid collectionId").exists().isMongoId(),
  body("status", "Please enter valid status like true, false").exists().isBoolean(),
];

const patchUpdateCollectionFeaturedStatus = [
  param("collectionId", "Please enter valid collectionId").exists().isMongoId(),
  body("isFeatured", "Please enter valid isFeatured like true, false").exists().isBoolean(),
];

export default {
  postAddCollection,
  putUpdateCollection,
  getCollection,
  deleteCollection,
  getCollections,
  putAttachCollections,
  putDeattachCollection,
  patchUpdateCollectionStatus,
  patchUpdateCollectionFeaturedStatus,
};
