"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminModule = exports.PriceDecisionFactor = exports.VerificationType = exports.ImageType = exports.HomeProduct = exports.Language = exports.PaymentMethod = exports.OrderStatus = exports.PaymentStatus = exports.ProductType = exports.Gender = exports.ApprovalStatus = exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["SUPER_ADMIN"] = "SUPER_ADMIN";
    UserRole["ADMIN"] = "ADMIN";
    UserRole["USER"] = "USER";
    UserRole["VENDOR"] = "VENDOR";
})(UserRole = exports.UserRole || (exports.UserRole = {}));
var ApprovalStatus;
(function (ApprovalStatus) {
    ApprovalStatus["PENDING"] = "PENDING";
    ApprovalStatus["APPROVED"] = "APPROVED";
    ApprovalStatus["DISAPPROVED"] = "DISAPPROVED";
})(ApprovalStatus = exports.ApprovalStatus || (exports.ApprovalStatus = {}));
var Gender;
(function (Gender) {
    Gender["MALE"] = "Male";
    Gender["FEMALE"] = "Female";
    Gender["OTHER"] = "Other";
})(Gender = exports.Gender || (exports.Gender = {}));
var ProductType;
(function (ProductType) {
    ProductType["Regular"] = "Regular";
    ProductType["Customized"] = "Customized";
})(ProductType = exports.ProductType || (exports.ProductType = {}));
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["PENDING"] = "PENDING";
    PaymentStatus["CANCELLED"] = "CANCELLED";
    PaymentStatus["COMPLETED"] = "COMPLETED";
})(PaymentStatus = exports.PaymentStatus || (exports.PaymentStatus = {}));
var OrderStatus;
(function (OrderStatus) {
    OrderStatus["PENDING"] = "PENDING";
    OrderStatus["PLACED"] = "PLACED";
    OrderStatus["PACKED"] = "PACKED";
    OrderStatus["SHIPPED"] = "SHIPPED";
    OrderStatus["DELIVERED"] = "DELIVERED";
    OrderStatus["CANCELLED"] = "CANCELLED";
    OrderStatus["RETURNED"] = "RETURNED";
})(OrderStatus = exports.OrderStatus || (exports.OrderStatus = {}));
var PaymentMethod;
(function (PaymentMethod) {
    PaymentMethod["PREPAID"] = "Prepaid";
    PaymentMethod["COD"] = "COD";
})(PaymentMethod = exports.PaymentMethod || (exports.PaymentMethod = {}));
var Language;
(function (Language) {
    Language["ENGLISH"] = "ENGLISH";
    Language["HINDI"] = "HINDI";
})(Language = exports.Language || (exports.Language = {}));
var HomeProduct;
(function (HomeProduct) {
    HomeProduct["HIGH_VIEWS"] = "HIGH_VIEWS";
    HomeProduct["HIGH_RATED"] = "HIGH_RATED";
})(HomeProduct = exports.HomeProduct || (exports.HomeProduct = {}));
var ImageType;
(function (ImageType) {
    ImageType["Slider"] = "";
    ImageType["Product"] = "";
})(ImageType = exports.ImageType || (exports.ImageType = {}));
var VerificationType;
(function (VerificationType) {
    VerificationType["SignUp"] = "Sign Up";
    VerificationType["ForgotPassword"] = "Forgot Password";
    VerificationType["AddFarmer"] = "Add Farmer";
})(VerificationType = exports.VerificationType || (exports.VerificationType = {}));
var PriceDecisionFactor;
(function (PriceDecisionFactor) {
    PriceDecisionFactor["Unit"] = "Unit";
    PriceDecisionFactor["KG"] = "KG";
    PriceDecisionFactor["Liter"] = "Liter";
})(PriceDecisionFactor = exports.PriceDecisionFactor || (exports.PriceDecisionFactor = {}));
var AdminModule;
(function (AdminModule) {
    AdminModule["MAIN_CATEGORY"] = "MAIN_CATEGORY";
    AdminModule["CATEGORY"] = "CATEGORY";
    AdminModule["VENDOR"] = "VENDOR";
    AdminModule["BRANDS"] = "BRANDS";
    AdminModule["ADVERTISE"] = "ADVERTISE";
    AdminModule["PRODUCT"] = "PRODUCT";
    AdminModule["VARIANT"] = "VARIANT";
    AdminModule["USER"] = "USER";
    AdminModule["ORDER"] = "ORDER";
    AdminModule["PAYOUT"] = "PAYOUT";
    AdminModule["CONTENT"] = "CONTENT";
    AdminModule["SLIDER"] = "SLIDER";
    AdminModule["DELIVERY_LOCATION"] = "DELIVERY_LOCATION";
    AdminModule["NOTIFICATION"] = "NOTIFICATION";
    AdminModule["CONTACT_USERS"] = "CONTACT_USERS";
    AdminModule["USERS_FEEDBACK"] = "USERS_FEEDBACK";
})(AdminModule = exports.AdminModule || (exports.AdminModule = {}));
