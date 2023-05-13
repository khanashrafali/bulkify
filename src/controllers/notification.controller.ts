import { NextFunction, Request, Response } from "express";
import { matchedData } from "express-validator";
import { notificationService } from "../services";
import { helper } from "../utils";
import { IRequest } from "../utils/interfaces";

/**
 * get user addresses api
 */
const getNotifications = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let result = await notificationService.getNotifications(req as IRequest, req.query);
    helper.buildResponse(res, "Notifications fetched Successfully", result);
  } catch (error) {
    next(error);
  }
};

/**
 * get user address api
 */
const getNotification = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let result = await notificationService.getNotification(req as IRequest, req.params.id);
    helper.buildResponse(res, "Notification fetched Successfully", result);
  } catch (error) {
    next(error);
  }
};

/**
 * post save user address api
 */
const saveNotification = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    let result = await notificationService.saveNotification(req as IRequest, matchedData(req));
    helper.buildResponse(res, "Notification saved successfully", result);
  } catch (error) {
    next(error);
  }
};

/**
 * post save user address api
 */
const updateNotification = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    let result = await notificationService.updateNotification(req as IRequest, req.params.id, matchedData(req));
    helper.buildResponse(res, "Notification updated Successfully", result);
  } catch (error) {
    next(error);
  }
};

/**
 * delete user address api
 */
const deleteNotification = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let result = await notificationService.deleteNotification(req as IRequest, req.params.id);
    helper.buildResponse(res, "Notification deleted successfully", result);
  } catch (error) {
    next(error);
  }
};

const readNotification = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let result = await notificationService.readNotification(req as IRequest, req.params.id);
    helper.buildResponse(res, "Notification status updated", result);
  } catch (error) {
    next(error);
  }
};

export default {
  getNotifications,
  getNotification,
  saveNotification,
  updateNotification,
  deleteNotification,
  readNotification,
};
