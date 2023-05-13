"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subAdminInviteEmail = void 0;
const subAdminInviteEmail = (name, email, password) => `
<p> Hey ${name}, </p>
<p> Welcome to Bubblix Manihar,</p>

<p> One Time Generated Credential for Login!</p>
<p> Your Login Email is: ${email}</p>

<p> Your Login Password is: ${password}</p>

<p> Please remember these Credentials for future login.</p>

<p> Regards</p>
<p> Team Manihar</p>
  `;
exports.subAdminInviteEmail = subAdminInviteEmail;
