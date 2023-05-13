import { body, CustomValidator, param, query } from "express-validator";
import { addressModel } from "../../models";
import { CONSTANT, helper } from "../../utils";
import { IRequest } from "../../utils/interfaces";

const postCreatePayout = [
  body("payouts", "Please enter valid payouts").exists().isArray({ min: 1 }),
  body("payouts.*.order", "Please enter valid order").exists().isMongoId(),
  body("payouts.*.vendor", "Please enter valid vendor").exists().isMongoId(),
  body("payouts.*.payoutAmount", "Please enter valid payoutAmount").exists().isInt({ gt: 0 }),
  body("payouts.*.orderAmount", "Please enter valid orderAmount").exists().isInt({ gt: 0 }),
  body("payouts.*.msg", "Please enter valid msg").optional().trim(),
  body("payouts.*.orderId", "Please enter valid orderId").exists().trim().notEmpty(),
  body("payouts.*.paymentMethod", "Please enter valid paymentMethod").exists().trim().notEmpty(),
];

const getPayout = [param("payoutId", "Please enter valid payoutId").exists().isMongoId()];

const getPayouts = [
  query("textSearch", "Please enter valid textSearch").optional().trim().notEmpty(),
  query("page", "Please enter valid page").optional().toInt().isInt({ gt: 0 }),
  query("pageSize", "Please enter valid pageSize").optional().toInt().isInt({ gt: 0 }),
];

export default {
  postCreatePayout,
  getPayout,
  getPayouts,
};
