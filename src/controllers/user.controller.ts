import { NextFunction, Request, Response } from "express";
import { matchedData } from "express-validator";
import { userService } from "../services";
import { emailHandler, helper } from "../utils";
import { IRequest } from "../utils/interfaces";

/**
 * get app users api
 */
const getAppUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    let result = await userService.getUsers(req.query);
    helper.buildResponse(res, "Users fetched sucessfully", result);
  } catch (error) {
    next(error);
  }
};

const adminDashboradInfo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    let result = await userService.adminDashboradInfo(req as IRequest);
    helper.buildResponse(res, "Dashboard Info fetched sucessfully", result);
  } catch (error) {
    next(error);
  }
};

const vendorDashboradInfo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    let result = await userService.vendorDashboradInfo(req as IRequest);
    helper.buildResponse(res, "Dashboard Info fetched sucessfully", result);
  } catch (error) {
    next(error);
  }
};

/**
 * subscribe user
 */
const postSubscribe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    await userService.subscribe(req.body.email, res);
    helper.buildResponse(res, "subscribe successfully.");
  } catch (error) {
    next(error);
  }
};

/**
 * subscribe user
 */
const updateStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    await userService.updateStatus(req.params.userId, req.body.status);
    helper.buildResponse(res, "Status updated Successfully.");
  } catch (error) {
    next(error);
  }
};

/**
 * get app home page
 */
const getAppHomePage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    let result = await userService.getAppHomePage(req.query);
    helper.buildResponse(res, "Fetched info.", result);
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    let result = await userService.updateProfile(req as IRequest, matchedData(req));
    helper.buildResponse(res, "Profile Updated.", result);
  } catch (error) {
    next(error);
  }
};

const deleteMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    let result = await userService.deleteMe(req as IRequest);
    helper.buildResponse(res, "Account Removed Successfully", result);
  } catch (error) {
    next(error);
  }
};

const postUserFeedback = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    let result = await userService.saveUserFeedback(req.body);
    helper.buildResponse(res, "Feedback Saved Successfully.", result);
    if (req.body.email?.length) await emailHandler.sentQueryEmail(req.body.email, req.body.name);
  } catch (error) {
    next(error);
  }
};

const getFeedBacks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    let result = await userService.getFeedBacks(req.query);
    helper.buildResponse(res, "Feedback Fetched Successfully.", result);
  } catch (error) {
    next(error);
  }
};

export default {
  getAppUsers,
  adminDashboradInfo,
  vendorDashboradInfo,
  postSubscribe,
  updateStatus,
  deleteMe,
  getAppHomePage,
  updateProfile,
  postUserFeedback,
  getFeedBacks,
};
