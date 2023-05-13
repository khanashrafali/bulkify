import { Request, Response } from "express";
import mongoose from "mongoose";

export interface User {
  name: string;
}

export enum UserRole {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  USER = "USER",
  VENDOR = "VENDOR",
}

export enum ApprovalStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  DISAPPROVED = "DISAPPROVED",
}

export enum Gender {
  MALE = "Male",
  FEMALE = "Female",
  OTHER = "Other",
}

export enum ProductType {
  Regular = "Regular",
  Customized = "Customized",
}

export interface Shifts {
  shifts: {
    [key: string]: {
      shift1: { startTime: string; endTime: string; deleted: boolean };
      shift2: { startTime: string; endTime: string; deleted: boolean };
      shift3: { startTime: string; endTime: string; deleted: boolean };
    };
  };
}

export enum PaymentStatus {
  PENDING = "PENDING",
  CANCELLED = "CANCELLED",
  COMPLETED = "COMPLETED",
}

export enum OrderStatus {
  PENDING = "PENDING",
  PLACED = "PLACED",
  PACKED = "PACKED",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
  RETURNED = "RETURNED",
}

export enum PaymentMethod {
  PREPAID = "Prepaid",
  COD = "COD",
}

export enum Language {
  ENGLISH = "ENGLISH",
  HINDI = "HINDI",
}

export enum HomeProduct {
  HIGH_VIEWS = "HIGH_VIEWS",
  HIGH_RATED = "HIGH_RATED",
}

export interface PageInfo {
  page: number;
  pageSize: number;
  skip: number;
}

export interface IRequest extends Request {
  user: mongoose.Document<any>;
  role: UserRole;
}

export interface ExRequest extends Request {}
export interface ExResponse extends Response {}

export interface RPayOrderResponse {
  id: string;
  entity: string;
  amount: number;
  amount_paid: number;
  amount_due: number;
  currency: string;
  receipt: string;
  offer_id: null;
  status: string;
  attempts: number;
  notes: object;
  created_at: number;
}

export enum ImageType {
  Slider = "",
  Product = "",
}

export enum VerificationType {
  SignUp = "Sign Up",
  ForgotPassword = "Forgot Password",
  AddFarmer = "Add Farmer",
}

export enum PriceDecisionFactor {
  Unit = "Unit",
  KG = "KG",
  Liter = "Liter",
}

export enum AdminModule {
  MAIN_CATEGORY = "MAIN_CATEGORY",
  CATEGORY = "CATEGORY",
  VENDOR = "VENDOR",
  BRANDS = "BRANDS",
  ADVERTISE = "ADVERTISE",
  PRODUCT = "PRODUCT",
  VARIANT = "VARIANT",
  USER = "USER",
  ORDER = "ORDER",
  PAYOUT = "PAYOUT",
  CONTENT = "CONTENT",
  SLIDER = "SLIDER",
  DELIVERY_LOCATION = "DELIVERY_LOCATION",
  NOTIFICATION = "NOTIFICATION",
  CONTACT_USERS = "CONTACT_USERS",
  USERS_FEEDBACK = "USERS_FEEDBACK",
}

export interface ErpProduct {
  RecordCount: number;
  RowNo: number;
  Id: string;
  Name: string;
  Code: string;
  Description: string;
  TenantId: string;
  CSPOrderUnitId: string;
  UnitId: string;
  UnitName: string;
  StoreName: string;
  Remarks: string;
  HSNCode: string;
  BatchRequired: boolean;
  MaintainSerialNumber: boolean;
  ItemGroupId: string;
  ItemGroupName: string;
  ProductGroupId: string;
  ProductGroupName: string;
  ItemClosingBal: number;
  MRP: number;
  SalesPrice: number;
  ItemImage: string;
  lstItemBIN: any[];
}

export interface MainCategory {
  name: string;
  image: string;
  status: boolean;
}

export interface VariantData {
  quantity: number;
  sellingPrice: number;
  mrp: number;
  badalDaloPrice: number;
  SKU: string;
}

export interface VariantsData {
  variant: VariantData;
}

export interface Brand {
  _id: string;
  brandName: string;
  image: string;
  isApproved: boolean;
  deleted: boolean;
}

export interface ProductItem {
  erpId: string;
  name: string;
  description: string;
  mainCategories: MainCategory[];
  images: string[];
  status: boolean;
  subCategories: [];
  tags: string[];
  isApproved: ApprovalStatus;
  metaDescription: string;
  variants: VariantsData[];
  brand: Brand | null;
  category: MainCategory | null;
  subCategory: MainCategory | null;
}
