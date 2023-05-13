import { body, CustomValidator, oneOf, param, query } from "express-validator";
import { addressModel, orderModel } from "../../models";
import { CONSTANT, helper } from "../../utils";
import { PaymentStatus } from "../../utils/interfaces";

const checkOrderId = async (val: string) => {
  let order = await orderModel.findOne({ rpay_orderId: val });
  if (order) throw helper.buildError("order id already used", 400);
};

// const checkBillingAddress: CustomValidator = async (val, { req }) => {
//   try {
//     let address = await addressModel.findOne({ _id: val });
//     if (!address) throw helper.buildError("No address found with this id", 404);
//   } catch (error) {
//     throw error;
//   }
// };

const cancelOrder = [
  param("orderId", "Please enter valid orderId").exists().trim().notEmpty(),
  // body("productId", "Please enter valid productId").optional({ nullable: true }).isMongoId(),
  // body("variantId", "Please enter valid variantId").optional({ nullable: true }).isMongoId(),
  // body("type", "Please enter valid type like ORDER,PRODUCT").exists().isIn(["ORDER", "PRODUCT"]),
];

const getOrder = [param("orderId", "Please enter valid orderId").exists()];

const getOrders = [
  query("currentOrderStatus", `Please enter valid currentOrderStatus ${CONSTANT.ORDER_STATUS.join(", ")}`)
    .optional()
    .isIn(CONSTANT.ORDER_STATUS),
  query("paymentStatus", `Please enter valid paymentStatus like ${CONSTANT.PAYMENT_STATUS.join(",")}`)
    .optional()
    .isIn(CONSTANT.PAYMENT_STATUS),
  query("createdAt", "Please enter valid createdAt").optional().isDate({ format: CONSTANT.DATE }),
  query("page", "Please enter valid page").optional().toInt().isInt({ gt: 0 }),
  query("pageSize", "Please enter valid pageSize").optional().toInt().isInt({ gt: 0 }),
  query("payoutCompelete", "Please enter valid payoutCompelete").optional().toBoolean().isBoolean(),
  oneOf(
    [
      query("vendor", "Please enter valid vendor").optional().isMongoId(),
      query("vendor", "Please enter valid vendor").optional().isIn(["ADMIN"]),
    ],
    "Please enter valid vendor"
  ),
];

const getOrdersByUserId = [param("userId", "Please enter valid userId").exists().isMongoId()];

const confirmOrder: any[] = [
  body("rpay_orderId", "Please enter valid rpay_orderId").exists().trim().custom(checkOrderId),
  body("rpay_paymentId", "Please enter valid rpay_paymentId").exists().trim(),
  body("rpay_signature", "Please enter valid rpay_signature").exists().trim(),
  body("reasonMessage").optional().trim(),
];

const createOrder = [
  body("shippingAddress", "Please enter valid shippingAddress").exists().isMongoId().bail(),
  // .custom(checkBillingAddress),
  body("paymentMethod", `Please enter valid paymentMethod like ${CONSTANT.PAYMENT_METHODS.join(", ")}`)
    .exists()
    .isIn(CONSTANT.PAYMENT_METHODS),
  // body("couponCode", "Please enter valid couponCode").optional().trim(),
  // body("day", "Please enter valid day").optional().trim(),
  // body("time", "Please enter valid time").optional().trim(),
];

const createBuyNowOrder = [
  query("productId", "Please enter valid productId").exists().isMongoId(),
  query("variantId", "Please enter valid variantId").exists().isMongoId(),
  query("quantity", "Please enter valid quantity").exists().isInt({ gt: 0 }),
  query("shippingAddress", "Please enter valid shippingAddress").exists().isMongoId().bail(),
  // .custom(checkBillingAddress),
  query("paymentMethod", `Please enter valid paymentMethod like ${CONSTANT.PAYMENT_METHODS.join(", ")}`)
    .exists()
    .isIn(CONSTANT.PAYMENT_METHODS),
  query("isBadalDaloAvailable", "Please enter valid isBadalDaloAvailable").optional().toBoolean().isBoolean(),
];

const putReturnOrder = [
  param("orderId", "Please enter valid orderId").exists().isMongoId(),
  body("vendorId", "Please enter valid vendorId").exists().isMongoId(),
  body("productId", "Please enter valid productId").exists().isMongoId(),
  body("variantId", "Please enter valid variantId").exists().isMongoId(),
];

const updateOrderStatus = [
  body("status", `Please enter vallid status like ${CONSTANT.ORDER_STATUS.join(", ")}`)
    .exists()
    .isIn(CONSTANT.ORDER_STATUS),
];

const updateOrderPaymentStatus = [
  body("status", `Please enter vallid status like ${CONSTANT.PAYMENT_STATUS.join(", ")}`)
    .exists()
    .isIn(CONSTANT.PAYMENT_STATUS),
];

const getOrdersByAdmin = [
  ...getOrders,
  query("payoutCompelete", "Please enter valid payoutCompelete").optional().toBoolean().isBoolean(),
];

const cancelOrderItem = [
  param("orderItemId", "Please enter valid orderItemId").exists().isMongoId(),
  param("orderId", "Please enter valid orderId").exists().trim().notEmpty(),
];

export default {
  cancelOrderItem,
  cancelOrder,
  getOrder,
  getOrders,
  updateOrderStatus,
  updateOrderPaymentStatus,
  getOrdersByUserId,
  confirmOrder,
  createOrder,
  createBuyNowOrder,
  putReturnOrder,
  getOrdersByAdmin,
};

// 628cc0e2b46a8a1789dfccd9
// 628cc0e2b46a8a1789dfccda
