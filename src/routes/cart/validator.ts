import { body, CustomValidator, param } from "express-validator";
import { cartModel } from "../../models";
import { helper } from "../../utils";

const checkItem: CustomValidator = async (val, { req }) => {
  let item = await cartModel.findById(val);
  if (!item) throw helper.buildError("No item found with this id", 404);
};

const postAddCartItem = [
  body("productId", "Please enter valid productId").exists().isMongoId(),
  body("variantId", "variant not available").exists().isMongoId(),
  body("quantity", "Please enter valid quantity").exists().isInt({ gt: 0 }),
];

const putRemoveCartItem = [
  param("itemId", "Please enter valid itemId").exists().isMongoId().custom(checkItem),
];

export default {
  postAddCartItem,
  putRemoveCartItem,
};
