"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const login_1 = require("./login");
const sub_admin_invite_1 = require("./sub-admin-invite");
const place_order_1 = require("./place_order");
const cancel_order_1 = require("./cancel_order");
const return_order_1 = require("./return_order");
const subscribe_1 = __importDefault(require("./subscribe"));
const invite_vendor_1 = __importDefault(require("./invite_vendor"));
const reset_vendor_password_1 = __importDefault(require("./reset_vendor_password"));
exports.default = {
    userLoginEmailTemplate: login_1.userLoginEmailTemplate,
    cancelOrderBankMailTemplate: cancel_order_1.cancelOrderBankMailTemplate,
    cancelOrderUserMailTemplate: cancel_order_1.cancelOrderUserMailTemplate,
    placeOrderUserMailTemplate: place_order_1.placeOrderUserMailTemplate,
    returnOrderBankMailTemplate: return_order_1.returnOrderBankMailTemplate,
    returnOrderUserMailTemplate: return_order_1.returnOrderUserMailTemplate,
    subscribeTamplate: subscribe_1.default,
    vendorInviteTamplate: invite_vendor_1.default,
    subAdminInviteEmail: sub_admin_invite_1.subAdminInviteEmail,
    resetPasswordByAdminVendorTamplate: reset_vendor_password_1.default,
};
