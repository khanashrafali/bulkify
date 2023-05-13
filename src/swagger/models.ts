import { bool } from "aws-sdk/clients/signer";
import { ApprovalStatus, UserRole } from "../utils/interfaces";

export interface CollectionReqBody {
  title: string;
  description: string;
  type: string;
  mustMatchAll: boolean;
  chartImage: string;
  image: string;
  conditions: {
    field: string;
    condition: string;
    value: string | number;
  }[];
}

export interface CreateProduct {
  name: string;
  description: string;
  category: string;
  subCategories: string[];
  tags: string[];
  images: string[];
  type: string;
  status: boolean;
  variants: {
    size: string;
    color: string;
    material: string;
    label: string;
    mrp: number;
    sellingPrice: number;
    quantity: number;
    SKU: string;
    deleted: boolean;
  }[];
  metaDescription: string;
}

export interface ApiResponse {
  message: string;
  data: any;
  statusCode: number;
  status: boolean;
}

export interface CategoriesResponse extends ApiResponse {
  data: { docs: TSOACategory[]; count: number };
}

export interface CategoryResponse extends ApiResponse {
  data: TSOACategory;
}

export interface CollectionsResponse extends ApiResponse {
  data: { docs: TSOACollection[]; count: number };
}

export interface CollectionResponse extends ApiResponse {
  data: TSOACollection;
}

export interface VendorsResponse extends ApiResponse {
  data: { docs: TSOAVendor[]; count: number };
}

export interface VendorResponse extends ApiResponse {
  data: TSOAVendor;
}

export interface ProductsResponse extends ApiResponse {
  data: { docs: TSOAProduct[]; count: number };
}

export interface ProductResponse extends ApiResponse {
  data: TSOAProduct;
}

export interface AddressesResponse extends ApiResponse {
  data: { docs: TSOAAddress[]; count: number };
}

export interface AddressResponse extends ApiResponse {
  data: TSOAAddress;
}

export interface BanksResponse extends ApiResponse {
  data: { docs: TSOABank[]; count: number };
}

export interface BankResponse extends ApiResponse {
  data: TSOABank;
}

export interface ContentsResponse extends ApiResponse {
  data: { docs: TSOAContent[]; count: number };
}

export interface ContentResponse extends ApiResponse {
  data: TSOAContent;
}

export interface FiltersResponse extends ApiResponse {
  data: { docs: TSOAFilter[]; count: number };
}

export interface FilterResponse extends ApiResponse {
  data: TSOAFilter;
}

export interface CouponsResponse extends ApiResponse {
  data: { docs: TSOACoupon[]; count: number };
}

export interface CouponResponse extends ApiResponse {
  data: TSOACoupon;
}

export interface ReviewsResponse extends ApiResponse {
  data: { docs: TSOAReview[]; count: number };
}

export interface ReviewResponse extends ApiResponse {
  data: TSOAReview;
}

export interface AdminsResponse extends ApiResponse {
  data: { docs: TSOAAdmin[]; count: number };
}

export interface AdminResponse extends ApiResponse {
  data: TSOAAdmin;
}

export interface DashboardResponse extends ApiResponse {
  data: Dashboard;
}

export interface UsersResponse extends ApiResponse {
  data: TSOAUser[];
}

export interface UserResponse extends ApiResponse {
  data: TSOAUser;
}

export interface TransactionResponse extends ApiResponse {
  data: TSOATransaction;
}

export interface TransactionsResponse extends ApiResponse {
  data: TSOATransaction[];
}

export interface PayoutResponse extends ApiResponse {
  data: TSOAPayout;
}

export interface PayoutsResponse extends ApiResponse {
  data: TSOAPayout[];
}

export interface TSOAFilter {
  categories: { _id: string; name: string }[];
  items: string[];
  status: boolean;
  date: string;
  deleted: boolean;
  _id: string;
  heading: string;
  createdAt: string;
  updatedAt: string;
}

export interface TSOAContent {
  _id: string;
  title: string;
  subTitle: string;
  sortDescription: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface TSOACategory {
  _id: string;
  subCategories: TSOASubCategory[];
  status: boolean;
  deleted: boolean;
  name: string;
  level: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  slug: string;
  __v: number;
  date: string;
}

export interface TSOASubCategory {
  _id: string;
  status: boolean;
  deleted: boolean;
  name: string;
  level: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  slug: string;
  __v: number;
  date: string;
  collections?: TSOACollection[];
}

export interface TSOACollection {
  _id: string;
  title: string;
  description: string;
  status: boolean;
  mustMatchAll: boolean;
  date: string;
  deleted: boolean;
  chartImage?: null | string;
  conditions: TSOAConditionElement[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  slug: string;
  __v: number;
  type?: string;
  image?: string;
}

export interface TSOAConditionElement {
  _id: string;
  field: TSOAField;
  condition: TSOAConditionEnum;
  value: string;
}

export enum TSOAConditionEnum {
  Contains = "CONTAINS",
  EndsWith = "ENDS_WITH",
  Equals = "EQUALS",
  GreaterThan = "GREATER_THAN",
  LessThan = "LESS_THAN",
  StartsWith = "STARTS_WITH",
}

export enum TSOAField {
  Title = "TITLE",
  Type = "TYPE",
  VariantCompareAtPrice = "VARIANT_COMPARE_AT_PRICE",
  VariantPrice = "VARIANT_PRICE",
  Vendor = "VENDOR",
}

export interface TSOAddress {
  location: TSOALocation;
  pinCode: string;
  city: string;
  state: string;
}

export interface TSOAVendor {
  _id: string;
  address: TSOAddress;
  email: string;
  mobileNumber: string;
  role: string;
  vendorStatus: boolean;
  isMobileVerified: boolean;
  isEmailVerified: boolean;
  deleted: boolean;
  vendorInfo: TSOAVendorInfo;
  createdAt: string;
  updatedAt: string;
  __v: number;
  expirationTime: null;
  varificationToken: null;
  isVendorProfileComplete: boolean;
  isApproved: string;
  date: string;
  name: string;
  isActive: boolean;
}

export interface TSOALocation {
  type: string;
  coordinates: number[];
}

export interface TSOAVendorInfo {
  _id: string;
  businessName: string;
  businessEmail: string;
  mobileNumber: string;
  gstNumber: string;
  panNumber: string;
  addressProof: string[];
  status: boolean;
  commissionPercent: number;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
  profileImage: string;
  date: string;
}

export interface TSOAProduct {
  _id: string;
  name: string;
  description: string;
  brand: null;
  images: string[];
  type: string;
  status: boolean;
  quantityDependent: boolean;
  isApproved: string;
  date: string;
  isFeatured: boolean;
  metaDescription: string;
  rating: number;
  ratingCount: number;
  viewCount: number;
  deleted: boolean;
  variants: TSOAVariant[];
  variantOptions: TSOAVariantOption[];
  vendor: TSOAVendor;
  userRole: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  slug: string;
  __v: number;
}

export interface TSOAVariantOption {
  type: TSOAVariantOptionType;
  values: string[];
  _id: string;
}

export enum TSOAVariantOptionType {
  Color = "Color",
  Material = "Material",
  Size = "Size",
}

export interface TSOAVariant {
  label: TSOALabel;
  price: number;
  comparePrice: null;
  quantity: number;
  SKU: string;
  _id: string;
}

export interface TSOALabel {
  Size?: string;
  Material?: string;
  Color?: string;
}

export interface TSOAAddress {
  _id: string;
  name: string;
  mobileNumber: string;
  email: string;
  landmark: string;
  address: string;
  houseNumber: string;
  city: string;
  pinCode: string;
  state: string;
  date: string;
  isDefault: boolean;
  deleted: boolean;
  tag: string;
  user: string;
  createdAt: string;
  updatedAt: string;
}

export interface TSOABank {
  _id: string;
  accountNumber: string;
  holderName: string;
  ifscCode: string;
  date: Date;
  user: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TSOACart {
  quantity: number;
  _id: string;
  product: TSOAProduct;
  vendor: string;
  variant: TSOAVariant;
  user: TSOAUser;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface TSOAUser {
  address: TSOAAddress;
  email: string;
  mobileNumber: string;
  role: UserRole;
  isVendorProfileComplete: boolean;
  isActive: boolean;
  vendorStatus: boolean;
  isApproved: ApprovalStatus;
  isMobileVerified: boolean;
  isEmailVerified: boolean;
  date: string;
  deleted: boolean;
  _id: string;
  name: string;
  varificationToken: null | string;
  expirationTime: null | string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface TSOASlide {
  title: string;
  desc: string;
  imageUrl: string;
  redirectUrl: string;
  _id: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface TSOACoupon {
  isPrivate: boolean;
  deleted: boolean;
  appliedCount: number;
  discountInPercent: number;
  numberOfUsers: number;
  date: string;
  _id: string;
  code: string;
  startDate: string;
  endDate: string;
  createBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface TSOAAdmin {
  _id: string;
  email: string;
  isActive: boolean;
  name: string;
  createdAt: string;
}

export interface Dashboard {
  message: string;
  data: {
    usersCount: number;
    categoriesCount: number;
    collectionsCount: number;
    couponsCount: number;
    ordersCount: number;
    productsCount: number;
    vendorsCount: number;
    adminsCount: number;
  };
  statusCode: number;
  status: boolean;
}

export enum Type {
  Point = "Point",
}

export interface TSOAReview {
  _id: string;
  rating: number;
  deleted: boolean;
  order: string;
  product: string;
  commentText: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// Generated by https://quicktype.io

export interface TSOATransaction {
  _id: string;
  isPayout: boolean;
  deleted: boolean;
  order: string;
  product: {
    _id: string;
    name: string;
  };
  price: number;
  role: string;
  txUser: {
    name: string;
  };
  amount: number;
  isCredited: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface TSOAPayout {
  _id: string;
  date: string;
  isCredited: boolean;
  deleted: boolean;
  sender: {
    name: string;
  };
  receiver: {
    vendorInfo: {
      businessName: string;
    };
    name: string;
  };
  paymentMethod: string;
  amount: number;
  createdAt: string;
  updatedAt: string;
}
