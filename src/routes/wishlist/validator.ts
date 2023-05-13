import { body, CustomValidator, param } from "express-validator";
import { wishlistModel } from "../../models";
import { helper } from "../../utils";

const checkItem: CustomValidator = async (val, { req }) => {
  let item = await wishlistModel.findById(val);
  if (!item) throw helper.buildError("No item found with this id", 404);
};

const addWishlistItem = [body("productId", "Please enter valid productId").exists().isMongoId()];

const deleteWishlistItem = [param("itemId", "Please enter valid itemId").exists().isMongoId().custom(checkItem)];

export default {
  addWishlistItem,
  deleteWishlistItem,
};
