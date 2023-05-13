import { NextFunction, Request, Response } from "express";
import { CONSTANT, helper } from "../utils";

/**
 * get product helper constants data api
 */
const getProductUtils = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.buildResponse(res, "Product utils fetched sucessfully", {
      fields: CONSTANT.PRODUCT_FIELDS,
      conditions: CONSTANT.PRODUCT_CONDITION(),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * get filter dorpdown
 */
const getFetchFilterDropdown = (req: Request, res: Response, next: NextFunction) => {
  try {
    return helper.buildResponse(res, "Filter dropdown fetched sucessfully", CONSTANT.FILTER_DROPDOWN);
  } catch (error) {
    next(error);
  }
};

const getAdminModules = (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.buildResponse(res, "Fetched admin modules", CONSTANT.ADMIN_MODULES);
  } catch (error) {
    throw error;
  }
};

export default {
  getProductUtils,
  getFetchFilterDropdown,
  getAdminModules,
};
