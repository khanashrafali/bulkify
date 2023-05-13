import { NextFunction, Request, Response } from "express";
import { matchedData } from "express-validator";
import { inventoryService } from "../services";
import { helper } from "../utils";
import { IRequest } from "../utils/interfaces";

/**
 * update product stock details
 */
const updateProductStockData = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    let result = await inventoryService.updateProductStockData(req.params.productId, matchedData(req));
    helper.buildResponse(res, "Details updated sucessfully", result);
  } catch (error) {
    next(error);
  }
};

export default {
  updateProductStockData,
};
