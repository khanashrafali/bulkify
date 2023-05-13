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
const utils_1 = require("../utils");
const ccavutil_1 = require("../utils/ccavutil");
utils_1.helper.loadEnvFile();
const postCheckoutRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // let dummyData = `merchant_id=957186&order_id=123456789&currency=INR&amount=1.00&redirect_url=[http://localhost=9005/ccavResponseHandler&cancel_url=http://localhost=9005/ccavResponseHandler&language=EN&billing_name=Peter&billing_address=Santacruz&]http://localhost=9005/ccavResponseHandler&cancel_url=http://localhost=9005/ccavResponseHandler&language=EN&billing_name=Peter&billing_address=Santacruz&billing_city=Mumbai&billing_state=MH&billing_zip=400054&billing_country=India&billing_tel=9876543210&billing_email=testing@domain.com&delivery_name=Sam&delivery_address=&Vile Parle`;
        var body = "", workingKey = process.env.WorkingKey, //Put in the 32-Bit key shared by CCAvenues.
        accessCode = process.env.AccessCode, //Put in the Access Code shared by CCAvenues.
        encRequest = "", formbody = "";
        req.on("data", function (data) {
            console.log("Data=======>", data);
            body += data;
            encRequest = (0, ccavutil_1.encrypt)(body, workingKey);
            console.log("My ENC========>", encRequest);
            formbody =
                '<form id="nonseamless" method="post" name="redirect" action="https://test.ccavenue.com/transaction/transaction.do?command=initiateTransaction"/> <input type="hidden" id="encRequest" name="encRequest" value="' +
                    encRequest +
                    '"><input type="hidden" name="access_code" id="access_code" value="' +
                    accessCode +
                    '"><script language="javascript">document.redirect.submit();</script></form>';
        });
        req.on("end", function () {
            res.writeHead(200, { "Content-Type": "text/html" });
            res.write(formbody);
            res.end();
        });
        return;
        // https://test.ccavenue.com/transaction/transaction.do?command=initiateTransaction&encRequest= &access_code=AVYO85JF01AF37OYFA
        //return `https://test.ccavenue.com/transaction/transaction.do?command=initiateTransaction&encRequest=${encRequest} &access_code=${accessCode}`;
    }
    catch (error) {
        throw error;
    }
});
const getOrderStatus = (order_id) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        var workingKey = process.env.WorkingKey, //Put in the 32-Bit key shared by CCAvenues.
        accessCode = process.env.AccessCode, //Put in the Access Code shared by CCAvenues.
        encRequest = "";
        let merchant_json_data = { order_no: order_id };
        let finalMerchentData = JSON.stringify(merchant_json_data);
        encRequest = (0, ccavutil_1.encrypt)(finalMerchentData, workingKey);
        let final_data = `enc_request=${encRequest}&access_code=${accessCode}&command=orderStatusTracker&request_type=JSON&response_type=JSON`;
        let reqponsData = yield axios_1.default.post("https://apitest.ccavenue.com/apis/servlet/DoWebTrans", final_data);
        let status = "";
        let information = reqponsData.data.split("&");
        for (let i = 0; i < information.length; i++) {
            let info_value = information[i].split("=");
            if (info_value[0] == "enc_response") {
                status = (0, ccavutil_1.decrypt)(info_value[1].trim(), workingKey);
            }
        }
        return (_a = JSON.parse(status)) === null || _a === void 0 ? void 0 : _a.Order_Status_Result;
    }
    catch (error) {
        throw error;
    }
});
exports.default = {
    postCheckoutRequest,
    getOrderStatus,
};
