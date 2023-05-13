import { Request, Response } from "express";
import axios from "axios";

import { helper } from "../utils";
import { decrypt, encrypt } from "../utils/ccavutil";

helper.loadEnvFile();

const postCheckoutRequest = async (req: Request, res: Response) => {
  try {
    // let dummyData = `merchant_id=957186&order_id=123456789&currency=INR&amount=1.00&redirect_url=[http://localhost=9005/ccavResponseHandler&cancel_url=http://localhost=9005/ccavResponseHandler&language=EN&billing_name=Peter&billing_address=Santacruz&]http://localhost=9005/ccavResponseHandler&cancel_url=http://localhost=9005/ccavResponseHandler&language=EN&billing_name=Peter&billing_address=Santacruz&billing_city=Mumbai&billing_state=MH&billing_zip=400054&billing_country=India&billing_tel=9876543210&billing_email=testing@domain.com&delivery_name=Sam&delivery_address=&Vile Parle`;
    var body = "",
      workingKey = process.env.WorkingKey, //Put in the 32-Bit key shared by CCAvenues.
      accessCode = process.env.AccessCode, //Put in the Access Code shared by CCAvenues.
      encRequest = "",
      formbody = "";

    req.on("data", function (data: any) {
      console.log("Data=======>", data);
      body += data;
      encRequest = encrypt(body, workingKey);
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
  } catch (error) {
    throw error;
  }
};

const getOrderStatus = async (order_id: string) => {
  try {
    var workingKey = process.env.WorkingKey, //Put in the 32-Bit key shared by CCAvenues.
      accessCode = process.env.AccessCode, //Put in the Access Code shared by CCAvenues.
      encRequest = "";
    let merchant_json_data = { order_no: order_id };

    let finalMerchentData = JSON.stringify(merchant_json_data);
    encRequest = encrypt(finalMerchentData, workingKey);
    let final_data = `enc_request=${encRequest}&access_code=${accessCode}&command=orderStatusTracker&request_type=JSON&response_type=JSON`;

    let reqponsData = await axios.post("https://apitest.ccavenue.com/apis/servlet/DoWebTrans", final_data);

    let status = "";
    let information = reqponsData.data.split("&");
    for (let i = 0; i < information.length; i++) {
      let info_value = information[i].split("=");
      if (info_value[0] == "enc_response") {
        status = decrypt(info_value[1].trim(), workingKey);
      }
    }

    return JSON.parse(status)?.Order_Status_Result;
  } catch (error) {
    throw error;
  }
};

export default {
  postCheckoutRequest,
  getOrderStatus,
};
