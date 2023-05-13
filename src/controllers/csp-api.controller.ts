import { NextFunction, Request, Response } from "express";
import { erpApiService } from "../services";
import { helper } from "../utils";

const cspLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let result = await erpApiService.cspLogin();
    return helper.buildResponse(res, "success", result);
  } catch (error) {
    next(error);
  }
};

const cspItemList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let result = await erpApiService.cspItemList();
    return helper.buildResponse(res, "success", result);
  } catch (error) {
    next(error);
  }
};

const postOnlineOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let result = await erpApiService.postOnlineOrder();
    return helper.buildResponse(res, "success", result);
  } catch (error) {
    next(error);
  }
};

const monitorOnlineOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let result = await erpApiService.monitorOnlineOrder();
    return helper.buildResponse(res, "success", result);
  } catch (error) {
    next(error);
  }
};

const saveErpDataIntoMarketPlace = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.buildResponse(res, "Pulling Started....");
    let result = await erpApiService.saveErpDataIntoMarketPlace();
  } catch (error) {
    next(error);
  }
};

export default {
  cspLogin,
  cspItemList,
  postOnlineOrder,
  monitorOnlineOrder,
  saveErpDataIntoMarketPlace,
};
