"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelOrderUserMailTemplate = exports.cancelOrderBankMailTemplate = void 0;
const cancelOrderBankMailTemplate = (orderInfo) => {
    return `
  <p>Hi HDFC Bank,</p>

  <p>Please find below the order details for which refund to be executed.</p>

  <p>Date: ${orderInfo.date}</p>
  <p>Order ID: ${orderInfo.orderId}</p>
  <p>Order Amount: ${orderInfo.variant.sellingPrice}</p>

  <p>Please process the same at your earliest.</p>

  <p>Regards</p>
  <p>Team Bubblix Manihar</p>

  <p>This will be done manually , Bubblix team will share the order details of the customer to the email id : ecomsupport.delhi@hdfcbank.com to process refund to the customer.</p>
  `;
};
exports.cancelOrderBankMailTemplate = cancelOrderBankMailTemplate;
const cancelOrderUserMailTemplate = (orderInfo) => {
    var _a;
    return `
  <p>Hi ${((_a = orderInfo === null || orderInfo === void 0 ? void 0 : orderInfo.user) === null || _a === void 0 ? void 0 : _a.name) || "User"},</p>

  <p>Your Order is Cancelled Successfully.</p>

  <p>Date: ${orderInfo.date}</p>
  <p>Order ID: ${orderInfo.orderId}</p>
  <p>Order Amount: ${orderInfo.variant.sellingPrice}</p>

  <p>Regards</p>
  <p>Team Bubblix Manihar</p>
  `;
};
exports.cancelOrderUserMailTemplate = cancelOrderUserMailTemplate;
