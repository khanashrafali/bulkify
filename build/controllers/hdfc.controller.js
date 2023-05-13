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
const services_1 = require("../services");
const utils_1 = require("../utils");
const ccavutil_1 = require("../utils/ccavutil");
const postRequest = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        var body = "", workingKey = process.env.WorkingKey, //Put in the 32-Bit key shared by CCAvenues.
        accessCode = process.env.AccessCode, //Put in the Access Code shared by CCAvenues.
        encRequest = "", formbody = "", query = req.query;
        console.log("Data=======>", query);
        body += `merchant_id=${query.merchant_id}&order_id=${query.order_id}&currency=${query.currency}&amount=${query.amount}&redirect_url=${query.redirect_url}&cancel_url=${query.cancel_url}&language=${query.language}&billing_name=${query.billing_name}&billing_address=${query.billing_address}&billing_city=${query.billing_city}&billing_state=${query.billing_state}&billing_zip=${query.billing_zip}&billing_country=${query.billing_country}&billing_tel=${query.billing_tel}&billing_email=${query.billing_email}&delivery_name=${query.delivery_name}&delivery_address=${query.delivery_address}&delivery_city=${query.delivery_city}&delivery_state=${query.delivery_state}&delivery_zip=${query.delivery_zip}&delivery_country=${query.delivery_country}&delivery_tel=${query.delivery_tel}&merchant_param1=${query.merchant_param1}&merchant_param2=${query.merchant_param2}&merchant_param3=${query.merchant_param3}&merchant_param4=${query.merchant_param4}&merchant_param5=${query.merchant_param5}&promo_code=${query.promo_code}&customer_identifier=${query.customer_identifier}`;
        encRequest = (0, ccavutil_1.encrypt)(body, workingKey);
        console.log("My ENC========>", encRequest);
        formbody =
            '<form id="nonseamless" method="post" name="redirect" action="https://test.ccavenue.com/transaction/transaction.do?command=initiateTransaction"/> <input type="hidden" id="encRequest" name="encRequest" value="' +
                encRequest +
                '"><input type="hidden" name="access_code" id="access_code" value="' +
                accessCode +
                '"><script language="javascript">document.redirect.submit();</script></form>';
        res.writeHead(200, { "Content-Type": "text/html" });
        res.write(formbody);
        res.end();
        return;
    }
    catch (error) {
        next(error);
    }
});
const getOrderStatus = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let data = yield services_1.hdfcService.getOrderStatus(req.query.orderId);
        utils_1.helper.buildResponse(res, "Order status fetch successfully!!!", data);
    }
    catch (error) {
        next(error);
        // console.log(JSON.stringify(error));
    }
});
exports.default = {
    postRequest,
    getOrderStatus,
};
