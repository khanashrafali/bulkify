import { NextFunction, Request, Response } from "express";
import { matchedData } from "express-validator";
import { reviewService } from "../services";
import { helper } from "../utils";
import { IRequest } from "../utils/interfaces";

/**
 * add product review
 */
const postAddReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    let files: any = req.files;
    await reviewService.addReview(req as IRequest, files.reviewFiles, req.body);
    helper.buildResponse(res, "Review saved successfully", files);
  } catch (error) {
    next(error);
  }
};

/**
 * get product reviews
 */
const getProductReviews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    const result = await reviewService.getProductReviews(req.params.productId);
    helper.buildResponse(res, "Reviews fetched successfully", result);
  } catch (error) {
    next(error);
  }
};

/**
 * remove product review
 */
const deleteReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    const result = await reviewService.deleteReview(req.params.reviewId);
    helper.buildResponse(res, "Review deleted successfully", result);
  } catch (error) {
    next(error);
  }
};

/**
 * get review by product id
 */
const getProductReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    const result = await reviewService.getUserProductReview(req as IRequest, req.query);
    helper.buildResponse(res, "Review fetched successfully", result);
  } catch (error) {
    next(error);
  }
};

const setAdminRating = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    await reviewService.setAdminRating(req.params.productId, req.body);
    helper.buildResponse(res, "Product rating updated.");
  } catch (error) {
    next(error);
  }
};

export default {
  postAddReview,
  getProductReviews,
  deleteReview,
  getProductReview,
  setAdminRating,
};
