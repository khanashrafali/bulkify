import moment from "moment";
import { couponModel } from "../models";
import { helper } from "../utils";
import { IRequest } from "../utils/interfaces";

helper.loadEnvFile();

/**
 * get coupon by id handler
 */
const _fetchCoupon = async (couponId: string) => {
  let coupon = await couponModel.findOne({ _id: couponId });
  if (!coupon) throw helper.buildError("No coupon found with this id", 404);
  return coupon;
};

/**
 * create coupon handler
 */
const addCoupon = async (req: IRequest, data: any) => {
  try {
    await couponModel.create({ ...data, createBy: req.user._id });
  } catch (error) {
    throw error;
  }
};

/**
 * update coupon handler
 */
const updateCoupon = async (couponId: string, data: any) => {
  try {
    await (await _fetchCoupon(couponId))?.set(data).save();
  } catch (error) {
    throw error;
  }
};

/**
 * update coupon status handler
 */
const updateCouponStatus = async (couponId: string, isPrivate: boolean) => {
  try {
    await (await _fetchCoupon(couponId)).set({ isPrivate }).save();
  } catch (error) {
    throw error;
  }
};

/**
 * delete coupon handler
 */
const deleteCoupon = async (couponId: string) => {
  try {
    await (await _fetchCoupon(couponId)).delete();
  } catch (error) {
    throw error;
  }
};

/**
 * get coupon by id handler
 */
const getCoupon = async (couponId: string) => {
  try {
    return await _fetchCoupon(couponId);
  } catch (error) {
    throw error;
  }
};

/**
 * get coupon list handler
 */
const getCoupons = async (queryParams: any) => {
  try {
    let condition: any = {};
    const pageInfo = helper.checkPagination(queryParams);

    if (queryParams.textSearch?.length) condition.code = { $regex: helper.regxEscape(queryParams.textSearch), $options: "i" };
    if ("status" in queryParams) condition.isPrivate = queryParams.status;
    if ("createdAt" in queryParams) condition.date = queryParams.createdAt;
    if ("endDate" in queryParams) condition.endDate = queryParams.endDate;
    if ("startDate" in queryParams) condition.startDate = queryParams.startDate;
    if ("discountInPercent" in queryParams) condition.discountInPercent = queryParams.discountInPercent;
    if ("numberOfUsers" in queryParams) condition.numberOfUsers = queryParams.numberOfUsers;

    const count = await couponModel.countDocuments(condition);
    const mongoQuery = couponModel.find(condition).sort({ createdAt: -1 });
    let docs: any[] = [];

    if (pageInfo) docs = await mongoQuery.skip(pageInfo.skip).limit(pageInfo.pageSize);
    else docs = await mongoQuery;

    return helper.makePaginatedData(docs, count, pageInfo);
  } catch (error) {
    throw error;
  }
};

/**
 * get coupon list for users handler
 */
const getCouponsByUsers = async (queryParams: any) => {
  try {
    let condition: any = { isPrivate: false };
    const pageInfo = helper.checkPagination(queryParams);

    if (queryParams.textSearch?.length) condition.code = { $regex: helper.regxEscape(queryParams.textSearch), $options: "i" };
    if ("createdAt" in queryParams) condition.date = queryParams.createdAt;
    if ("endDate" in queryParams) condition.endDate = queryParams.endDate;
    if ("startDate" in queryParams) condition.startDate = queryParams.startDate;
    if ("discountInPercent" in queryParams) condition.discountInPercent = queryParams.discountInPercent;
    if ("numberOfUsers" in queryParams) condition.numberOfUsers = queryParams.numberOfUsers;

    const count = await couponModel.countDocuments(condition);
    const mongoQuery = couponModel.find(condition).sort({ createdAt: -1 });
    let docs: any[] = [];

    if (pageInfo) docs = await mongoQuery.skip(pageInfo.skip).limit(pageInfo.pageSize);
    else docs = await mongoQuery;

    return helper.makePaginatedData(docs, count, pageInfo);
  } catch (error) {
    throw error;
  }
};

/**
 * get coupon by code handler
 */
const postApplyCoupon = async (code: string) => {
  try {
    let now = helper.currentDate;
    let condition: any = { code, isPrivate: false, startDate: { $lte: now }, endDate: { $gte: now } };
    const coupon = await couponModel.findOne(condition);

    if (!coupon) throw helper.buildError("No valid coupon found with this code", 404);
    const couponToJson: any = coupon.toJSON();
    if (couponToJson.appliedCount >= couponToJson.numberOfUsers) throw helper.buildError("Coupon expired", 400);
    return couponToJson;
  } catch (error) {
    throw error;
  }
};

export default {
  addCoupon,
  updateCoupon,
  deleteCoupon,
  getCoupon,
  updateCouponStatus,
  getCoupons,
  postApplyCoupon,
  getCouponsByUsers,
};
