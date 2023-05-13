"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const models_1 = require("../../models");
const utils_1 = require("../../utils");
const checkOrderId = (val) => __awaiter(void 0, void 0, void 0, function* () {
    let order = yield models_1.orderModel.findOne({ rpay_orderId: val });
    if (order)
        throw utils_1.helper.buildError("order id already used", 400);
});
// const checkBillingAddress: CustomValidator = async (val, { req }) => {
//   try {
//     let address = await addressModel.findOne({ _id: val });
//     if (!address) throw helper.buildError("No address found with this id", 404);
//   } catch (error) {
//     throw error;
//   }
// };
const cancelOrder = [
    (0, express_validator_1.param)("orderId", "Please enter valid orderId").exists().trim().notEmpty(),
    // body("productId", "Please enter valid productId").optional({ nullable: true }).isMongoId(),
    // body("variantId", "Please enter valid variantId").optional({ nullable: true }).isMongoId(),
    // body("type", "Please enter valid type like ORDER,PRODUCT").exists().isIn(["ORDER", "PRODUCT"]),
];
const getOrder = [(0, express_validator_1.param)("orderId", "Please enter valid orderId").exists()];
const getOrders = [
    (0, express_validator_1.query)("currentOrderStatus", `Please enter valid currentOrderStatus ${utils_1.CONSTANT.ORDER_STATUS.join(", ")}`)
        .optional()
        .isIn(utils_1.CONSTANT.ORDER_STATUS),
    (0, express_validator_1.query)("paymentStatus", `Please enter valid paymentStatus like ${utils_1.CONSTANT.PAYMENT_STATUS.join(",")}`)
        .optional()
        .isIn(utils_1.CONSTANT.PAYMENT_STATUS),
    (0, express_validator_1.query)("createdAt", "Please enter valid createdAt").optional().isDate({ format: utils_1.CONSTANT.DATE }),
    (0, express_validator_1.query)("page", "Please enter valid page").optional().toInt().isInt({ gt: 0 }),
    (0, express_validator_1.query)("pageSize", "Please enter valid pageSize").optional().toInt().isInt({ gt: 0 }),
    (0, express_validator_1.query)("payoutCompelete", "Please enter valid payoutCompelete").optional().toBoolean().isBoolean(),
    (0, express_validator_1.oneOf)([
        (0, express_validator_1.query)("vendor", "Please enter valid vendor").optional().isMongoId(),
        (0, express_validator_1.query)("vendor", "Please enter valid vendor").optional().isIn(["ADMIN"]),
    ], "Please enter valid vendor"),
];
const getOrdersByUserId = [(0, express_validator_1.param)("userId", "Please enter valid userId").exists().isMongoId()];
const confirmOrder = [
    (0, express_validator_1.body)("rpay_orderId", "Please enter valid rpay_orderId").exists().trim().custom(checkOrderId),
    (0, express_validator_1.body)("rpay_paymentId", "Please enter valid rpay_paymentId").exists().trim(),
    (0, express_validator_1.body)("rpay_signature", "Please enter valid rpay_signature").exists().trim(),
    (0, express_validator_1.body)("reasonMessage").optional().trim(),
];
const createOrder = [
    (0, express_validator_1.body)("shippingAddress", "Please enter valid shippingAddress").exists().isMongoId().bail(),
    // .custom(checkBillingAddress),
    (0, express_validator_1.body)("paymentMethod", `Please enter valid paymentMethod like ${utils_1.CONSTANT.PAYMENT_METHODS.join(", ")}`)
        .exists()
        .isIn(utils_1.CONSTANT.PAYMENT_METHODS),
    // body("couponCode", "Please enter valid couponCode").optional().trim(),
    // body("day", "Please enter valid day").optional().trim(),
    // body("time", "Please enter valid time").optional().trim(),
];
const createBuyNowOrder = [
    (0, express_validator_1.query)("productId", "Please enter valid productId").exists().isMongoId(),
    (0, express_validator_1.query)("variantId", "Please enter valid variantId").exists().isMongoId(),
    (0, express_validator_1.query)("quantity", "Please enter valid quantity").exists().isInt({ gt: 0 }),
    (0, express_validator_1.query)("shippingAddress", "Please enter valid shippingAddress").exists().isMongoId().bail(),
    // .custom(checkBillingAddress),
    (0, express_validator_1.query)("paymentMethod", `Please enter valid paymentMethod like ${utils_1.CONSTANT.PAYMENT_METHODS.join(", ")}`)
        .exists()
        .isIn(utils_1.CONSTANT.PAYMENT_METHODS),
    (0, express_validator_1.query)("isBadalDaloAvailable", "Please enter valid isBadalDaloAvailable").optional().toBoolean().isBoolean(),
];
const putReturnOrder = [
    (0, express_validator_1.param)("orderId", "Please enter valid orderId").exists().isMongoId(),
    (0, express_validator_1.body)("vendorId", "Please enter valid vendorId").exists().isMongoId(),
    (0, express_validator_1.body)("productId", "Please enter valid productId").exists().isMongoId(),
    (0, express_validator_1.body)("variantId", "Please enter valid variantId").exists().isMongoId(),
];
const updateOrderStatus = [
    (0, express_validator_1.body)("status", `Please enter vallid status like ${utils_1.CONSTANT.ORDER_STATUS.join(", ")}`)
        .exists()
        .isIn(utils_1.CONSTANT.ORDER_STATUS),
];
const updateOrderPaymentStatus = [
    (0, express_validator_1.body)("status", `Please enter vallid status like ${utils_1.CONSTANT.PAYMENT_STATUS.join(", ")}`)
        .exists()
        .isIn(utils_1.CONSTANT.PAYMENT_STATUS),
];
const getOrdersByAdmin = [
    ...getOrders,
    (0, express_validator_1.query)("payoutCompelete", "Please enter valid payoutCompelete").optional().toBoolean().isBoolean(),
];
const cancelOrderItem = [
    (0, express_validator_1.param)("orderItemId", "Please enter valid orderItemId").exists().isMongoId(),
    (0, express_validator_1.param)("orderId", "Please enter valid orderId").exists().trim().notEmpty(),
];
exports.default = {
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
