"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderStatusWithSno = exports.VideoMIME_TYPES = exports.ImageMIME_TYPES = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const _1 = require(".");
const interfaces_1 = require("./interfaces");
const USER_ROLES = [interfaces_1.UserRole.SUPER_ADMIN, interfaces_1.UserRole.USER, interfaces_1.UserRole.ADMIN, interfaces_1.UserRole.VENDOR];
const GENDERS = [interfaces_1.Gender.MALE, interfaces_1.Gender.FEMALE, interfaces_1.Gender.OTHER];
const LANGUAGES = [interfaces_1.Language.HINDI, interfaces_1.Language.ENGLISH];
const PRODUCT_TYPE = [interfaces_1.ProductType.Regular, interfaces_1.ProductType.Customized];
const APPROVAL_STATUS = [interfaces_1.ApprovalStatus.PENDING, interfaces_1.ApprovalStatus.APPROVED, interfaces_1.ApprovalStatus.DISAPPROVED];
exports.ImageMIME_TYPES = ["image/jpg", "image/jpeg", "image/png", "image/svg"];
exports.VideoMIME_TYPES = ["video/mp4"];
const TIME = "H:m A";
const DATE = "YYYY-MM-DD";
const PAYMENT_METHODS = [interfaces_1.PaymentMethod.COD, interfaces_1.PaymentMethod.PREPAID];
const PAYMENT_STATUS = [interfaces_1.PaymentStatus.PENDING, interfaces_1.PaymentStatus.CANCELLED, interfaces_1.PaymentStatus.COMPLETED];
const ORDER_STATUS = [
    interfaces_1.OrderStatus.PLACED,
    interfaces_1.OrderStatus.PACKED,
    interfaces_1.OrderStatus.SHIPPED,
    interfaces_1.OrderStatus.DELIVERED,
    interfaces_1.OrderStatus.CANCELLED,
    interfaces_1.OrderStatus.RETURNED,
];
const HOME_PAGE_PRODUCTS = [interfaces_1.HomeProduct.HIGH_RATED, interfaces_1.HomeProduct.HIGH_VIEWS];
exports.OrderStatusWithSno = {
    PENDING: 0,
    PLACED: 1,
    PACKED: 2,
    SHIPPED: 3,
    DELIVERED: 4,
    CANCELLED: 5,
    RETURNED: 6,
};
const REGX = {
    Email: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
    AlphaWithSpecial: /^[a-zA-Z._^%$&#!~@, -]*$/,
    Alphabets: /^[a-zA-Z ]*$/,
    AlphabetsWithDots: /^[a-zA-Z. ]*$/,
    AlphabetsWithSlash: /^[a-zA-Z0-9/.& ]*$/,
    Password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[|)(@\<{}>[\]/$!%*?:;.,=&_#~"'`^+-])[A-Za-z\d|)(@\<{}>[\]/$!%*?:;.,=&_#~"'`^+-]{8,}$/,
    Pincode: /^[1-9][0-9]{5}$/,
    Alphanumeric: /^[a-zA-Z0-9]*$/,
    PositiveInt: /^\d*$/,
    IFSC: /^([A-Za-z]{4}0[A-Za-z0-9]{6})$/,
    GST: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
    PAN: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
};
const PRODUCT_FIELDS = [
    { key: "TITLE", field: "name", value: "Product title" },
    // { key: "TYPE", field: "type", value: "Product type" },
    { key: "VENDOR", field: "vendor", value: "Product vendor" },
    { key: "VARIANT_PRICE", field: "variants.variant.sellingPrice", value: "Product price" },
    // { key: "TAG", field: "name", value: "Product tag" },
    { key: "VARIANT_COMPARE_AT_PRICE", field: "variants.variant.mrp", value: "Compare at price" },
    // {key:'VARIANT_WEIGHT',field:'name',value:'Weight'},
    { key: "VARIANT_INVENTORY", field: "variants.variant.quantity", value: "Inventory stock" },
    // { key: "VARIANT_TITLE", field: "name", value: "Variant’s title" },
];
const PRODUCT_CONDITION = (field = "", val = "") => {
    let isNumber = false;
    if (!["name", "type", "vendor"].includes(field))
        isNumber = true;
    return [
        {
            key: "EQUALS",
            value: "is equal to",
            query: {
                [field]: isNumber
                    ? { $eq: +val }
                    : field == "vendor"
                        ? mongoose_1.default.Types.ObjectId(val)
                        : {
                            $regex: new RegExp(`^${_1.helper.regxEscape(val)}`),
                            // $options: "i",
                        },
            },
        },
        {
            key: "NOT_EQUALS",
            value: "is not equal to",
            query: {
                [field]: isNumber
                    ? { $ne: +val }
                    : field == "vendor"
                        ? { $ne: mongoose_1.default.Types.ObjectId(val) }
                        : { $not: { $regex: new RegExp(`^${_1.helper.regxEscape(val)}`), $options: "i" } },
            },
        },
        {
            key: "GREATER_THAN",
            value: "is greater than",
            query: { [field.split(".")[0]]: { $elemMatch: { [field.split(".")[1]]: { $gt: +val } } } },
        },
        {
            key: "LESS_THAN",
            value: "is less than",
            query: { [field.split(".")[0]]: { $elemMatch: { [field.split(".")[1]]: { $lt: +val } } } },
        },
        {
            key: "STARTS_WITH",
            value: "starts with",
            query: {
                [field]: field == "vendor"
                    ? mongoose_1.default.Types.ObjectId(val)
                    : { $regex: new RegExp(`^${_1.helper.regxEscape(val)}`), $options: "i" },
            },
        },
        {
            key: "ENDS_WITH",
            value: "ends with",
            query: {
                [field]: field == "vendor"
                    ? mongoose_1.default.Types.ObjectId(val)
                    : { $regex: new RegExp(`${_1.helper.regxEscape(val)}$`), $options: "i" },
            },
        },
        {
            key: "CONTAINS",
            value: "contains",
            query: {
                [field]: field == "vendor" ? mongoose_1.default.Types.ObjectId(val) : { $regex: _1.helper.regxEscape(val), $options: "i" },
            },
        },
        {
            key: "NOT_CONTAINS",
            value: "does not contain",
            query: {
                [field]: field == "vendor"
                    ? { ne: mongoose_1.default.Types.ObjectId(val) }
                    : { $not: new RegExp(`^${_1.helper.regxEscape(val)}$`) },
            },
        },
        { key: "IS_SET", value: "is not empty", query: { [field]: { $exists: true, $ne: null } } },
        { key: "IS_NOT_SET", value: "is empty", query: { [field]: { $exists: true, $ne: null } } },
    ];
};
const FILTER_DROPDOWN = [
    { level: "Featured", key: "FEATURED", orderBy: 1, sortBy: "name" },
    { level: "Best Selling", key: "BEST_SELLING", orderBy: 1, sortBy: "name" },
    { level: "Alphabetically, A-Z", key: "ALPHA_A_TO_Z", orderBy: 1, sortBy: "name" },
    { level: "Alphabetically, Z-A", key: "ALPHA_Z_TO_A", orderBy: -1, sortBy: "name" },
    { level: "Price, Low to High", key: "PRICE_LOW_TO_HIGH", orderBy: 1, sortBy: "variants.0.price" },
    { level: "Price, High to Low", key: "PRICE_HIGH_TO_LOW", orderBy: -1, sortBy: "variants.0.price" },
    { level: "Date, Old To New", key: "DATE_OLD_TO_NEW", orderBy: 1, sortBy: "createdAt" },
    { level: "Date, New To Old", key: "DATE_NEW_TO_OLD", orderBy: -1, sortBy: "createdAt" },
];
const PRICE_DECISION_FACTOR = [interfaces_1.PriceDecisionFactor.KG, interfaces_1.PriceDecisionFactor.Liter, interfaces_1.PriceDecisionFactor.Unit];
const ADMIN_MODULES = [
    interfaces_1.AdminModule.MAIN_CATEGORY,
    interfaces_1.AdminModule.CATEGORY,
    interfaces_1.AdminModule.VENDOR,
    interfaces_1.AdminModule.BRANDS,
    interfaces_1.AdminModule.ADVERTISE,
    interfaces_1.AdminModule.PRODUCT,
    interfaces_1.AdminModule.VARIANT,
    interfaces_1.AdminModule.USER,
    interfaces_1.AdminModule.ORDER,
    interfaces_1.AdminModule.PAYOUT,
    interfaces_1.AdminModule.CONTENT,
    interfaces_1.AdminModule.SLIDER,
    interfaces_1.AdminModule.DELIVERY_LOCATION,
    interfaces_1.AdminModule.NOTIFICATION,
    interfaces_1.AdminModule.CONTACT_USERS,
    interfaces_1.AdminModule.USERS_FEEDBACK,
];
exports.default = {
    USER_ROLES,
    GENDERS,
    REGX,
    TIME,
    DATE,
    ImageMIME_TYPES: exports.ImageMIME_TYPES,
    VideoMIME_TYPES: exports.VideoMIME_TYPES,
    PRODUCT_TYPE,
    PRODUCT_FIELDS,
    PRODUCT_CONDITION,
    APPROVAL_STATUS,
    PAYMENT_STATUS,
    FILTER_DROPDOWN,
    ORDER_STATUS,
    HOME_PAGE_PRODUCTS,
    PAYMENT_METHODS,
    PRICE_DECISION_FACTOR,
    ADMIN_MODULES,
};
