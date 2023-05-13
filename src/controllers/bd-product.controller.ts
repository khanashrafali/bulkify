import { NextFunction, Request, Response } from "express";
import { bdProductService } from "../services";
import { helper } from "../utils";
import { IRequest } from "../utils/interfaces";

const addBDProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    let result = await bdProductService.addBDProduct(
      req as IRequest,
      req.body.product,
      req.body.variant,
      req.body.comment,
      (req.file as any)?.Location
    );
    helper.buildResponse(res, "Item added To BadalDalo Product", result);
  } catch (error) {
    next(error);
  }
};

const deleteDBProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    await bdProductService.deleteDBProduct(
      (req as IRequest).user._id.toString(),
      req.params.productId,
      req.params.variantId
    );
    helper.buildResponse(res, "Item deleted from BadalDalo Product");
  } catch (error) {
    next(error);
  }
};

const getBDProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    let result = await bdProductService.getBDProducts((req as IRequest).user._id);
    helper.buildResponse(res, "BadalDalo Product fetched successfully", result);
  } catch (error) {
    next(error);
  }
};

const clearBDProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    await bdProductService.clearBDProducts((req as IRequest).user._id);
    helper.buildResponse(res, "BadalDalo Product cleared successully");
  } catch (error) {
    next(error);
  }
};

export default {
  addBDProduct,
  deleteDBProduct,
  getBDProducts,
  clearBDProducts,
};
