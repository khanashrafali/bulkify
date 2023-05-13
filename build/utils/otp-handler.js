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
const axios_1 = __importDefault(require("axios"));
const userLoginOTP = (mobileNumber, otp) => __awaiter(void 0, void 0, void 0, function* () {
    let msg = encodeURI(` Dear customer, use this One Time Password ${otp} to log in to your Manihar India account.
      This OTP will be valid for the next 5 mins.BXROOM `);
    let options = {
        method: "GET",
        /*'url': 'http://nimbusit.biz/api/SmsApi/SendSingleApi?UserID=ESWASTHALYA&Password=byyi1466BY&SenderID=SWSTHU&Phno=9781715353&Msg=Hi+Laundiyabaaz',*/
        url: `http://nimbusit.biz/api/SmsApi/SendSingleApi` +
            `?UserID=${process.env.OTP_USER_ID}` +
            `&TemplateID=1507165935116757181` +
            `&Password=${process.env.OTP_PASSWORD}` +
            `&SenderID=${process.env.OTP_SENDER_ID}` +
            `&Phno=${mobileNumber}` +
            `&Msg=${msg}`,
        headers: { "Content-Type": "application/json" },
    };
    try {
        let rs = yield (0, axios_1.default)({ url: options.url, method: "GET", headers: options.headers });
    }
    catch (error) {
        console.log(error);
    }
});
const resetPasswordOtp = (mobileNumber, otp) => __awaiter(void 0, void 0, void 0, function* () {
    let msg = encodeURI(`Dear customer, OTP to reset your Manihar India Customer Account Login Password is ${otp}.
     Do not share with anyone. BXROOM `);
    let options = {
        method: "GET",
        /*'url': 'http://nimbusit.biz/api/SmsApi/SendSingleApi?UserID=ESWASTHALYA&Password=byyi1466BY&SenderID=SWSTHU&Phno=9781715353&Msg=Hi+Laundiyabaaz',*/
        url: `http://nimbusit.biz/api/SmsApi/SendSingleApi` +
            `?UserID=${process.env.OTP_USER_ID}` +
            `&TemplateID=1507165935121429705` +
            `&Password=${process.env.OTP_PASSWORD}` +
            `&SenderID=${process.env.OTP_SENDER_ID}` +
            `&Phno=${mobileNumber}` +
            `&Msg=${msg}`,
        headers: { "Content-Type": "application/json" },
    };
    try {
        yield (0, axios_1.default)({ url: options.url, method: "GET", headers: options.headers });
    }
    catch (error) {
        console.log(error);
    }
});
const orderConfirmationOtp = (mobileNumber) => __awaiter(void 0, void 0, void 0, function* () {
    let msg = encodeURI(`Dear customer, OTP to reset your Manihar India Customer Account Login Password is {otp}.
     Do not share with anyone. BXROOM `);
    let options = {
        method: "GET",
        /*'url': 'http://nimbusit.biz/api/SmsApi/SendSingleApi?UserID=ESWASTHALYA&Password=byyi1466BY&SenderID=SWSTHU&Phno=9781715353&Msg=Hi+Laundiyabaaz',*/
        url: `http://nimbusit.biz/api/SmsApi/SendSingleApi` +
            `?UserID=${process.env.OTP_USER_ID}` +
            `&TemplateID=1507165935121429705` +
            `&Password=${process.env.OTP_PASSWORD}` +
            `&SenderID=${process.env.OTP_SENDER_ID}` +
            `&Phno=${mobileNumber}` +
            `&Msg=${msg}`,
        headers: { "Content-Type": "application/json" },
    };
    try {
        yield (0, axios_1.default)({ url: options.url, method: "GET", headers: options.headers });
    }
    catch (error) {
        console.log(error);
    }
});
const paymentConfirmationOtp = (mobileNumber) => __awaiter(void 0, void 0, void 0, function* () {
    let msg = encodeURI(`Dear customer, OTP to reset your Manihar India Customer Account Login Password is {otp}.
     Do not share with anyone. BXROOM `);
    let options = {
        method: "GET",
        /*'url': 'http://nimbusit.biz/api/SmsApi/SendSingleApi?UserID=ESWASTHALYA&Password=byyi1466BY&SenderID=SWSTHU&Phno=9781715353&Msg=Hi+Laundiyabaaz',*/
        url: `http://nimbusit.biz/api/SmsApi/SendSingleApi` +
            `?UserID=${process.env.OTP_USER_ID}` +
            `&TemplateID=1507165935121429705` +
            `&Password=${process.env.OTP_PASSWORD}` +
            `&SenderID=${process.env.OTP_SENDER_ID}` +
            `&Phno=${mobileNumber}` +
            `&Msg=${msg}`,
        headers: { "Content-Type": "application/json" },
    };
    try {
        let rs = yield (0, axios_1.default)({ url: options.url, method: "GET", headers: options.headers });
    }
    catch (error) {
        console.log(error);
    }
});
exports.default = { userLoginOTP, resetPasswordOtp, orderConfirmationOtp, paymentConfirmationOtp };
