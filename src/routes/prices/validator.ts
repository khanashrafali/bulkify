import { body, param, query } from "express-validator";
import { pricesModel } from "../../models";
import { CONSTANT, helper } from "../../utils";

const getPrices = [query("to", "Please enter valid to").optional().isMongoId()];

const addPrice = [
  body("heading", "Please enter valid heading").exists().trim().notEmpty(),
  body("key").exists().trim().notEmpty(),
  body("diffrence").exists().isInt({ gt: -1 }),
  body("from", "Please enter valid from").exists().isInt({ gt: -1 }),
  body("to", "Please enter valid to").exists().isInt({ gt: -1 }),
];

const deletePrice = [
  param("priceId", "Please enter valid price id")
    .exists()
    .isMongoId()
    .custom(async (v, { req }) => {
      let price = await pricesModel.findOne({ _id: v });
      if (!price) throw helper.buildError("no price found with this id", 404);
    }),
];

const updatePrice = [...deletePrice, ...addPrice];

export default {
  addPrice,
  updatePrice,
  getPrices,
  deletePrice,
};
