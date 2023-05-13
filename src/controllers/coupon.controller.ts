import { NextFunction, Request, Response } from "express";
import { matchedData } from "express-validator";
import { couponService } from "../services";
import { helper } from "../utils";
import { IRequest } from "../utils/interfaces";

/**
 * create coupon api
 */
const postAddCoupon = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    await couponService.addCoupon(req as IRequest, matchedData(req));
    helper.buildResponse(res, "Coupon added sucessfully");
  } catch (error) {
    next(error);
  }
};

/**
 * update coupon api
 */
const putUpdateCoupon = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    await couponService.updateCoupon(req.params.couponId, matchedData(req));
    helper.buildResponse(res, "Coupon updated sucessfully");
  } catch (error) {
    next(error);
  }
};

/**
 * update coupon status api
 */
const patchUpdateCouponStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    await couponService.updateCouponStatus(req.params.couponId, req.body.isPrivate);
    helper.buildResponse(res, "Coupon status updated sucessfully");
  } catch (error) {
    next(error);
  }
};

/**
 * delete coupon api
 */
const deleteCoupon = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    await couponService.deleteCoupon(req.params.couponId);
    helper.buildResponse(res, "Coupon deleted sucessfully");
  } catch (error) {
    next(error);
  }
};

/**
 * get single coupon api
 */
const getCoupon = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    let result = await couponService.getCoupon(req.params.couponId);
    helper.buildResponse(res, "Coupon fetched sucessfully", result);
  } catch (error) {
    next(error);
  }
};

/**
 * get coupons api
 */
const getCoupons = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    let result = await couponService.getCoupons(req.query);
    helper.buildResponse(res, "Coupons fetched sucessfully", result);
  } catch (error) {
    next(error);
  }
};

/**
 * apply coupon api
 */
const postApplyCoupon = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    let result = await couponService.postApplyCoupon(req.body.code);
    helper.buildResponse(res, "Coupon fetched successfully", result);
  } catch (error) {
    next(error);
  }
};

/**
 * get coupons by users api
 */
const getCouponByUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    let result = await couponService.getCouponsByUsers(req.query);
    helper.buildResponse(res, "Coupons fetched sucessfully", result);
  } catch (error) {
    next(error);
  }
};

export default {
  postAddCoupon,
  putUpdateCoupon,
  patchUpdateCouponStatus,
  deleteCoupon,
  getCoupon,
  getCoupons,
  postApplyCoupon,
  getCouponByUsers,
};
