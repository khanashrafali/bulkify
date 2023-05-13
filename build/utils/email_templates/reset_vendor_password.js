"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (vendorName, email, password) => {
    return `
  <p> Hey ${vendorName},</p>
  <p> Welcome to Bubblix Manihar,</p>

  <p> Your New Credential for Login!</p>
  <p> Your Login Email is: ${email}</p>

  <p> Your Login Password is: ${password}</p>

  <p> Please remember these Credentials for future login.</p>

  <p> Regards</p>
  <p> Team Manihar</p>
    `;
};
