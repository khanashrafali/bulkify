import { NextFunction, Request, Response } from "express";
import { variantService } from "../services";
import { helper } from "../utils";

const addVariant = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    let result = await variantService.addVariant(req.body);
    return helper.buildResponse(res, "Variant Added", result);
  } catch (error) {
    next(error);
  }
};

const updateVariant = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    let result = await variantService.updateVariant(req.params.variantId, req.body);
    return helper.buildResponse(res, "Variant Updated", result);
  } catch (error) {
    next(error);
  }
};

const updateVariantStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    let result = await variantService.updateVariantStatus(req.params.variantId, req.body.status);
    return helper.buildResponse(res, "Variant Status Updated", result);
  } catch (error) {
    next(error);
  }
};

const getVariant = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    let result = await variantService.getVariant(req.params.variantId);
    return helper.buildResponse(res, "Fetched Variant", result);
  } catch (error) {
    next(error);
  }
};

const getVariants = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    let result = await variantService.getVariants(req.query);
    return helper.buildResponse(res, "Fetched Variants", result);
  } catch (error) {
    next(error);
  }
};

const getVariantByAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    let result = await variantService.getVariantByAdmin(req.params.variantId);
    return helper.buildResponse(res, "Fetched Variant", result);
  } catch (error) {
    next(error);
  }
};

const getVariantsByAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    let result = await variantService.getVariantsByAdmin(req.query);
    return helper.buildResponse(res, "Fetched Variants", result);
  } catch (error) {
    next(error);
  }
};

const deleteVariant = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    let result = await variantService.deleteVariant(req.params.variantId);
    return helper.buildResponse(res, "Variant Deleted", result);
  } catch (error) {
    next(error);
  }
};

export default {
  addVariant,
  updateVariant,
  getVariant,
  getVariants,
  deleteVariant,
  getVariantByAdmin,
  getVariantsByAdmin,
  updateVariantStatus,
};
