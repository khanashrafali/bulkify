import { NextFunction, Request, Response } from "express";
import { payoutService } from "../services";
import { helper } from "../utils";
import { IRequest } from "../utils/interfaces";

/**
 * create payout
 */
const postCreatePayout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let ireq = req as IRequest;
    helper.handlePayloadError(req);
    let result = await payoutService.postCreatePayout(ireq, req.body);
    helper.buildResponse(res, "Payout created sucessfully", result);
  } catch (error) {
    next(error);
  }
};

/**
 * get payout
 */
const getPayout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let ireq = req as IRequest;
    helper.handlePayloadError(req);
    let result = await payoutService.getPayout(req.params.payoutId);
    helper.buildResponse(res, "Fetch Payout sucessfully", result);
  } catch (error) {
    next(error);
  }
};

/**
 * get payouts
 */
const getPayouts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let ireq = req as IRequest;
    helper.handlePayloadError(req);
    let result = await payoutService.getPayouts(ireq.query);
    helper.buildResponse(res, "Fetch payouts sucessfully", result);
  } catch (error) {
    next(error);
  }
};

export default {
  postCreatePayout,
  getPayout,
  getPayouts,
};
