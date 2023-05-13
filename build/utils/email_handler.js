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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const _1 = require(".");
_1.helper.loadEnvFile();
// sent email handler
const sentMail = (toMail, subject, html = "") => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transporter = nodemailer_1.default.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            auth: { user: "mailto:info.manihar@gmail.com", pass: "kvgwuqavrquecvxg" },
        });
        yield transporter.sendMail({ from: '"Manihar" info.manihar@gmail.com', to: toMail, subject, html });
    }
    catch (error) {
        console.log(error);
    }
});
const userLoginOtpMail = (email, otp) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield sentMail(email, "Welcome to Manihar", _1.emailTemplates.userLoginEmailTemplate(otp));
    }
    catch (error) {
        console.log(error);
    }
});
const sentPlaceOrderMail = (orderInfo) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if (!((_a = orderInfo.user.email) === null || _a === void 0 ? void 0 : _a.length))
            return;
        yield sentMail(orderInfo.user.email, "Manihar - Order Placed", yield _1.emailTemplates.placeOrderUserMailTemplate(orderInfo));
    }
    catch (error) {
        console.log(error);
    }
});
const sentOrderCancelMail = (orderInfo) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        if (!((_b = orderInfo.user.email) === null || _b === void 0 ? void 0 : _b.length))
            return;
        yield sentMail(orderInfo.user.email, "Manihar - Order Cancelled", yield _1.emailTemplates.cancelOrderUserMailTemplate(orderInfo));
    }
    catch (error) {
        console.log(error);
    }
});
const sentOrderReturnMail = (orderInfo) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    try {
        if (!((_c = orderInfo.user.email) === null || _c === void 0 ? void 0 : _c.length))
            return;
        yield sentMail(orderInfo.user.email, "Manihar - Order Returned", yield _1.emailTemplates.returnOrderUserMailTemplate(orderInfo));
    }
    catch (error) {
        console.log(error);
    }
});
const sentInviteMailToAdmin = (name, email, password) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield sentMail(email, `Manihar - Login Credentials`, _1.emailTemplates.subAdminInviteEmail(name, email, password));
    }
    catch (error) {
        console.log(error);
    }
});
const sentSubscribeMail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield sentMail(email, "Manihar Subscribe", _1.emailTemplates.subscribeTamplate());
    }
    catch (error) {
        console.log(error);
    }
});
const sentVendorInvitationMail = (vendorName, email, password) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield sentMail(email, "Manihar - Login Credentials", _1.emailTemplates.vendorInviteTamplate(vendorName, email, password));
    }
    catch (error) {
        console.log(error);
    }
});
const resetPasswordByAdminVendorTamplate = (vendorName, email, password) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield sentMail(email, "Manihar - Login Credentials", _1.emailTemplates.resetPasswordByAdminVendorTamplate(vendorName, email, password));
    }
    catch (error) {
        console.log(error);
    }
});
const sentForgotPasswordEmail = (userToJson, token, uri) => __awaiter(void 0, void 0, void 0, function* () {
    const url = `${process.env.BASE_URL}/${uri}/${token}`;
    try {
        yield sentMail(userToJson.email, "Manihar Reset Password", `<h5><a href="${url}">Reset Password</a></h5>`);
    }
    catch (error) {
        console.log(error);
    }
    finally {
        return url;
    }
});
const sentQueryEmail = (toMail, name) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let html = `
      Hi ${name}.
      Manihar India Pvt. Ltd is in the business of operating a technology
      backed Omni-channel market place (“Online marketplace”) of various categories
      of products and services through its online portal, own apps, partner portals
      and apps and/or other sales/lead channels. Manihar India Pvt. Ltd
      owns a website which is an online market place, where users of the Website can
      place order/(s) on various listed Seller to fulfill the same.
      `;
        yield sentMail(toMail, "Welcome to Manihar", html);
    }
    catch (error) {
        return error;
    }
});
exports.default = {
    sentMail,
    userLoginOtpMail,
    sentPlaceOrderMail,
    sentOrderCancelMail,
    sentInviteMailToAdmin,
    sentSubscribeMail,
    sentVendorInvitationMail,
    sentForgotPasswordEmail,
    sentQueryEmail,
    resetPasswordByAdminVendorTamplate,
    sentOrderReturnMail,
};
