import { NextFunction, Request, Response } from "express";
import { matchedData } from "express-validator";
import { bankService } from "../services";
import { helper } from "../utils";
import { IRequest } from "../utils/interfaces";

/**
 * get user banks api
 */
const getBanks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let result = await bankService.getBanks(req as IRequest);
    helper.buildResponse(res, "Banks fetched Successfully", result);
  } catch (error) {
    next(error);
  }
};

/**
 * get user bank api
 */
const getBank = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let result = await bankService.getBank(req as IRequest, req.params.bankId);
    helper.buildResponse(res, "Bank fetched Successfully", result);
  } catch (error) {
    next(error);
  }
};

/**
 * post save user bank api
 */
const saveBank = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    let result = await bankService.addBank(req as IRequest, matchedData(req));
    helper.buildResponse(res, "Bank saved successfully", result);
  } catch (error) {
    next(error);
  }
};

/**
 * post save user bank api
 */
const updateBank = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    let result = await bankService.updateBank(req as IRequest, req.params.bankId, matchedData(req));
    helper.buildResponse(res, "Bank updated Successfully", result);
  } catch (error) {
    next(error);
  }
};

/**
 * delete user bank api
 */
const deleteBank = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let result = await bankService.deleteBank(req as IRequest, req.params.bankId);
    helper.buildResponse(res, "Bank deleted successfully", result);
  } catch (error) {
    next(error);
  }
};

/**
 * make default user bank api
 */
const putSetDefaultBank = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let result = await bankService.makeDefaultBank(req as IRequest, req.params.bankId);
    helper.buildResponse(res, "Bank make dafault successfully", result);
  } catch (error) {
    next(error);
  }
};

export default {
  getBanks,
  getBank,
  saveBank,
  updateBank,
  deleteBank,
  putSetDefaultBank,
};
