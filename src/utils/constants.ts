import mongoose from "mongoose";
import { helper } from ".";
import {
  ApprovalStatus,
  Gender,
  Language,
  PaymentStatus,
  OrderStatus,
  ProductType,
  UserRole,
  HomeProduct,
  PaymentMethod,
  PriceDecisionFactor,
  AdminModule,
} from "./interfaces";

const USER_ROLES = [UserRole.SUPER_ADMIN, UserRole.USER, UserRole.ADMIN, UserRole.VENDOR];
const GENDERS = [Gender.MALE, Gender.FEMALE, Gender.OTHER];
const LANGUAGES = [Language.HINDI, Language.ENGLISH];
const PRODUCT_TYPE = [ProductType.Regular, ProductType.Customized];
const APPROVAL_STATUS = [ApprovalStatus.PENDING, ApprovalStatus.APPROVED, ApprovalStatus.DISAPPROVED];

export const ImageMIME_TYPES: string[] = ["image/jpg", "image/jpeg", "image/png", "image/svg"];
export const VideoMIME_TYPES: string[] = ["video/mp4"];

const TIME = "H:m A";
const DATE = "YYYY-MM-DD";
const PAYMENT_METHODS = [PaymentMethod.COD, PaymentMethod.PREPAID];
const PAYMENT_STATUS: string[] = [PaymentStatus.PENDING, PaymentStatus.CANCELLED, PaymentStatus.COMPLETED];
const ORDER_STATUS: string[] = [
  OrderStatus.PLACED,
  OrderStatus.PACKED,
  OrderStatus.SHIPPED,
  OrderStatus.DELIVERED,
  OrderStatus.CANCELLED,
  OrderStatus.RETURNED,
];
const HOME_PAGE_PRODUCTS = [HomeProduct.HIGH_RATED, HomeProduct.HIGH_VIEWS];

export const OrderStatusWithSno = {
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
  Password:
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[|)(@\<{}>[\]/$!%*?:;.,=&_#~"'`^+-])[A-Za-z\d|)(@\<{}>[\]/$!%*?:;.,=&_#~"'`^+-]{8,}$/,
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

const PRODUCT_CONDITION = (field: string = "", val: string = "") => {
  let isNumber = false;

  if (!["name", "type", "vendor"].includes(field)) isNumber = true;

  return [
    {
      key: "EQUALS",
      value: "is equal to",
      query: {
        [field]: isNumber
          ? { $eq: +val }
          : field == "vendor"
          ? mongoose.Types.ObjectId(val)
          : {
              $regex: new RegExp(`^${helper.regxEscape(val)}`),
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
          ? { $ne: mongoose.Types.ObjectId(val) }
          : { $not: { $regex: new RegExp(`^${helper.regxEscape(val)}`), $options: "i" } },
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
        [field]:
          field == "vendor"
            ? mongoose.Types.ObjectId(val)
            : { $regex: new RegExp(`^${helper.regxEscape(val)}`), $options: "i" },
      },
    },
    {
      key: "ENDS_WITH",
      value: "ends with",
      query: {
        [field]:
          field == "vendor"
            ? mongoose.Types.ObjectId(val)
            : { $regex: new RegExp(`${helper.regxEscape(val)}$`), $options: "i" },
      },
    },
    {
      key: "CONTAINS",
      value: "contains",
      query: {
        [field]: field == "vendor" ? mongoose.Types.ObjectId(val) : { $regex: helper.regxEscape(val), $options: "i" },
      },
    },
    {
      key: "NOT_CONTAINS",
      value: "does not contain",
      query: {
        [field]:
          field == "vendor"
            ? { ne: mongoose.Types.ObjectId(val) }
            : { $not: new RegExp(`^${helper.regxEscape(val)}$`) },
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

const PRICE_DECISION_FACTOR = [PriceDecisionFactor.KG, PriceDecisionFactor.Liter, PriceDecisionFactor.Unit];

const ADMIN_MODULES: AdminModule[] = [
  AdminModule.MAIN_CATEGORY,
  AdminModule.CATEGORY,
  AdminModule.VENDOR,
  AdminModule.BRANDS,
  AdminModule.ADVERTISE,
  AdminModule.PRODUCT,
  AdminModule.VARIANT,
  AdminModule.USER,
  AdminModule.ORDER,
  AdminModule.PAYOUT,
  AdminModule.CONTENT,
  AdminModule.SLIDER,
  AdminModule.DELIVERY_LOCATION,
  AdminModule.NOTIFICATION,
  AdminModule.CONTACT_USERS,
  AdminModule.USERS_FEEDBACK,
];

export default {
  USER_ROLES,
  GENDERS,
  REGX,
  TIME,
  DATE,
  ImageMIME_TYPES,
  VideoMIME_TYPES,
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
