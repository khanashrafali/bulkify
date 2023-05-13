"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.placeOrderUserMailTemplate = void 0;
const placeOrderUserMailTemplate = (orderInfo) => {
    var _a;
    return `
  <p>Hi ${((_a = orderInfo === null || orderInfo === void 0 ? void 0 : orderInfo.user) === null || _a === void 0 ? void 0 : _a.name) || "User"},</p>

  <p>Your Order Placed Successfully.</p>

  <p>Date: ${orderInfo.date}</p>
  <p>Order ID: ${orderInfo.orderId}</p>
  <p>Order Amount: ${orderInfo.variant.sellingPrice}</p>

  <p>Regards</p>
  <p>Team Bubblix Manihar</p>
  `;
};
exports.placeOrderUserMailTemplate = placeOrderUserMailTemplate;
