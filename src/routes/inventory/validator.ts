import { body, CustomValidator, param, query } from "express-validator";
import { productModel } from "../../models";
import validator from "validator";
import { CONSTANT, helper } from "../../utils";

const checkDuplicateProduct: CustomValidator = async (val, { req }) => {
  let conditions: any = { name: { $regex: helper.regxEscape(val), $options: "i" } };
  let pId = req.params?.productIdOrSlug;
  if (pId) validator.isMongoId(pId) ? (conditions._id = { $ne: pId }) : (conditions.slug = { $ne: pId });
  const product = await productModel.findOne(conditions);
  if (product) throw helper.buildError("Same product already exists", 400);
};

const updateProductStockData = [
  param("productId", "Please enter valid product id")
    .exists()
    .isMongoId()
    .custom(async (v, { req }) => {
      const product = await productModel.findOne({ _id: v });
      if (!product) throw helper.buildError("no product found with this id", 404);
    }),
  body("images", "Images should not be empty").isArray({ min: 1 }),
  body("images.*", "Images should not be empty").trim().notEmpty().isURL(),
  body("name", "Please enter valid name").exists().trim().notEmpty().custom(checkDuplicateProduct),
  body("description", "Please enter valid description").exists().trim().notEmpty(),
  body("status", "Please enter valid status like true, false").exists().trim().isIn(["true", "false"]).toBoolean(),
  body("variants", "Please enter valid variants").exists().isArray({ min: 1 }),
  body("metaDescription", "Please enter valid meta description").exists().trim().notEmpty(),
  body("variants.*.variant.SKU", "Please enter valid variant's SKU")
    .exists()
    .trim()
    .isAlphanumeric("en-IN")
    .withMessage("SKU must be alphanumeric"),
  body("variants.*.variant.mrp", "Please enter valid variant's mrp").exists().isFloat({ gt: 0 }),
  body("variants.*.variant.sellingPrice", "Please enter valid variant's sellingPrice").exists().isFloat({ gt: 0 }),
  body("variants.*.variant.quantity", "Please enter valid variant's quantity").exists().isInt({ gt: 0 }),
  body("variants.*.variant.deleted", "Please enter valid variant's deleted").exists().isBoolean(),
  body("category", "Please enter valid category").exists().isMongoId(),
  // body("subCategories", "Please enter valid sub Categories").exists().isArray(),
  // body("subCategories.*", "Please enter valid sub Category id").optional().isMongoId(),
  body("tags", "Please enter valid tags").exists().isArray(),
];

export default {
  updateProductStockData,
};
