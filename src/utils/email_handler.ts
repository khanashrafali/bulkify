import nodemailer from "nodemailer";
import { emailTemplates, helper } from ".";

helper.loadEnvFile();

// sent email handler
const sentMail = async (toMail: string, subject: string, html: string = "") => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      auth: { user: "mailto:info.manihar@gmail.com", pass: "kvgwuqavrquecvxg" },
    });
    await transporter.sendMail({ from: '"Manihar" info.manihar@gmail.com', to: toMail, subject, html });
  } catch (error) {
    console.log(error);
  }
};

const userLoginOtpMail = async (email: string, otp: string) => {
  try {
    await sentMail(email, "Welcome to Manihar", emailTemplates.userLoginEmailTemplate(otp));
  } catch (error) {
    console.log(error);
  }
};

const sentPlaceOrderMail = async (orderInfo: any) => {
  try {
    if (!orderInfo.user.email?.length) return;
    await sentMail(orderInfo.user.email, "Manihar - Order Placed", await emailTemplates.placeOrderUserMailTemplate(orderInfo));
  } catch (error) {
    console.log(error);
  }
};

const sentOrderCancelMail = async (orderInfo: any) => {
  try {
    if (!orderInfo.user.email?.length) return;
    await sentMail(orderInfo.user.email, "Manihar - Order Cancelled", await emailTemplates.cancelOrderUserMailTemplate(orderInfo));
  } catch (error) {
    console.log(error);
  }
};

const sentOrderReturnMail = async (orderInfo: any) => {
  try {
    if (!orderInfo.user.email?.length) return;
    await sentMail(orderInfo.user.email, "Manihar - Order Returned", await emailTemplates.returnOrderUserMailTemplate(orderInfo));
  } catch (error) {
    console.log(error);
  }
};

const sentInviteMailToAdmin = async (name: string, email: string, password: string) => {
  try {
    await sentMail(email, `Manihar - Login Credentials`, emailTemplates.subAdminInviteEmail(name, email, password));
  } catch (error) {
    console.log(error);
  }
};

const sentSubscribeMail = async (email: string) => {
  try {
    await sentMail(email, "Manihar Subscribe", emailTemplates.subscribeTamplate());
  } catch (error) {
    console.log(error);
  }
};

const sentVendorInvitationMail = async (vendorName: string, email: string, password: string) => {
  try {
    await sentMail(email, "Manihar - Login Credentials", emailTemplates.vendorInviteTamplate(vendorName, email, password));
  } catch (error) {
    console.log(error);
  }
};

const resetPasswordByAdminVendorTamplate = async (vendorName: string, email: string, password: string) => {
  try {
    await sentMail(email, "Manihar - Login Credentials", emailTemplates.resetPasswordByAdminVendorTamplate(vendorName, email, password));
  } catch (error) {
    console.log(error);
  }
};

const sentForgotPasswordEmail = async (userToJson: any, token: string, uri: string) => {
  const url = `${process.env.BASE_URL}/${uri}/${token}`;
  try {
    await sentMail(userToJson.email, "Manihar Reset Password", `<h5><a href="${url}">Reset Password</a></h5>`);
  } catch (error) {
    console.log(error);
  } finally {
    return url;
  }
};

const sentQueryEmail = async (toMail: string, name: string) => {
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

    await sentMail(toMail, "Welcome to Manihar", html);
  } catch (error) {
    return error;
  }
};

export default {
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
