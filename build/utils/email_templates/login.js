"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userLoginEmailTemplate = void 0;
const userLoginEmailTemplate = (otp) => `
<p>Dear customer,</p>

<p>use this One Time Password ${otp} to log in to your Manihar India account.</p>
<p>This OTP will be valid for the next 5 mins.</p>

<p>Regards</p>
<p>Team Manihar</p>
`;
exports.userLoginEmailTemplate = userLoginEmailTemplate;
