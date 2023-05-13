import axios from "axios";

const userLoginOTP = async (mobileNumber: string, otp: number | string) => {
  let msg = encodeURI(
    ` Dear customer, use this One Time Password ${otp} to log in to your Manihar India account.
      This OTP will be valid for the next 5 mins.BXROOM `
  );

  let options = {
    method: "GET",
    /*'url': 'http://nimbusit.biz/api/SmsApi/SendSingleApi?UserID=ESWASTHALYA&Password=byyi1466BY&SenderID=SWSTHU&Phno=9781715353&Msg=Hi+Laundiyabaaz',*/
    url:
      `http://nimbusit.biz/api/SmsApi/SendSingleApi` +
      `?UserID=${process.env.OTP_USER_ID}` +
      `&TemplateID=1507165935116757181` +
      `&Password=${process.env.OTP_PASSWORD}` +
      `&SenderID=${process.env.OTP_SENDER_ID}` +
      `&Phno=${mobileNumber}` +
      `&Msg=${msg}`,
    headers: { "Content-Type": "application/json" },
  };

  try {
    let rs = await axios({ url: options.url, method: "GET", headers: options.headers });
  } catch (error) {
    console.log(error);
  }
};

const resetPasswordOtp = async (mobileNumber: string, otp: number | string) => {
  let msg = encodeURI(
    `Dear customer, OTP to reset your Manihar India Customer Account Login Password is ${otp}.
     Do not share with anyone. BXROOM `
  );

  let options = {
    method: "GET",
    /*'url': 'http://nimbusit.biz/api/SmsApi/SendSingleApi?UserID=ESWASTHALYA&Password=byyi1466BY&SenderID=SWSTHU&Phno=9781715353&Msg=Hi+Laundiyabaaz',*/
    url:
      `http://nimbusit.biz/api/SmsApi/SendSingleApi` +
      `?UserID=${process.env.OTP_USER_ID}` +
      `&TemplateID=1507165935121429705` +
      `&Password=${process.env.OTP_PASSWORD}` +
      `&SenderID=${process.env.OTP_SENDER_ID}` +
      `&Phno=${mobileNumber}` +
      `&Msg=${msg}`,
    headers: { "Content-Type": "application/json" },
  };

  try {
    await axios({ url: options.url, method: "GET", headers: options.headers });
  } catch (error) {
    console.log(error);
  }
};

const orderConfirmationOtp = async (mobileNumber: string) => {
  let msg = encodeURI(
    `Dear customer, OTP to reset your Manihar India Customer Account Login Password is {otp}.
     Do not share with anyone. BXROOM `
  );

  let options = {
    method: "GET",
    /*'url': 'http://nimbusit.biz/api/SmsApi/SendSingleApi?UserID=ESWASTHALYA&Password=byyi1466BY&SenderID=SWSTHU&Phno=9781715353&Msg=Hi+Laundiyabaaz',*/
    url:
      `http://nimbusit.biz/api/SmsApi/SendSingleApi` +
      `?UserID=${process.env.OTP_USER_ID}` +
      `&TemplateID=1507165935121429705` +
      `&Password=${process.env.OTP_PASSWORD}` +
      `&SenderID=${process.env.OTP_SENDER_ID}` +
      `&Phno=${mobileNumber}` +
      `&Msg=${msg}`,
    headers: { "Content-Type": "application/json" },
  };

  try {
    await axios({ url: options.url, method: "GET", headers: options.headers });
  } catch (error) {
    console.log(error);
  }
};

const paymentConfirmationOtp = async (mobileNumber: string) => {
  let msg = encodeURI(
    `Dear customer, OTP to reset your Manihar India Customer Account Login Password is {otp}.
     Do not share with anyone. BXROOM `
  );

  let options = {
    method: "GET",
    /*'url': 'http://nimbusit.biz/api/SmsApi/SendSingleApi?UserID=ESWASTHALYA&Password=byyi1466BY&SenderID=SWSTHU&Phno=9781715353&Msg=Hi+Laundiyabaaz',*/
    url:
      `http://nimbusit.biz/api/SmsApi/SendSingleApi` +
      `?UserID=${process.env.OTP_USER_ID}` +
      `&TemplateID=1507165935121429705` +
      `&Password=${process.env.OTP_PASSWORD}` +
      `&SenderID=${process.env.OTP_SENDER_ID}` +
      `&Phno=${mobileNumber}` +
      `&Msg=${msg}`,
    headers: { "Content-Type": "application/json" },
  };

  try {
    let rs = await axios({ url: options.url, method: "GET", headers: options.headers });
  } catch (error) {
    console.log(error);
  }
};

export default { userLoginOTP, resetPasswordOtp, orderConfirmationOtp, paymentConfirmationOtp };
