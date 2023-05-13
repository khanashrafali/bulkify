import { body, CustomValidator, param } from "express-validator";
import { bdProductModel } from "../../models";
import { helper } from "../../utils";

const checkItem: CustomValidator = async (val, { req }) => {
  let item = await bdProductModel.findById(val);
  if (!item) throw helper.buildError("No item found with this id", 404);
};

const addBDProduct = [
  body("product", "Please enter valid productId").exists().isMongoId(),
  body("variant", "Please enter valid variant").exists().isMongoId(),
];

const deleteDBProduct = [
  param("productId", "Please enter valid productId").exists().isMongoId(),
  param("variantId", "Please enter valid variantId").exists().isMongoId(),
];

export default {
  addBDProduct,
  deleteDBProduct,
};
