import { userLoginEmailTemplate } from "./login";
import { subAdminInviteEmail } from "./sub-admin-invite";
import { placeOrderUserMailTemplate } from "./place_order";
import { cancelOrderBankMailTemplate, cancelOrderUserMailTemplate } from "./cancel_order";
import { returnOrderBankMailTemplate, returnOrderUserMailTemplate } from "./return_order";
import subscribeTamplate from "./subscribe";
import vendorInviteTamplate from "./invite_vendor";
import resetPasswordByAdminVendorTamplate from "./reset_vendor_password";

export default {
  userLoginEmailTemplate,
  cancelOrderBankMailTemplate,
  cancelOrderUserMailTemplate,
  placeOrderUserMailTemplate,
  returnOrderBankMailTemplate,
  returnOrderUserMailTemplate,
  subscribeTamplate,
  vendorInviteTamplate,
  subAdminInviteEmail,
  resetPasswordByAdminVendorTamplate,
};
