import { NextFunction, Request, Response } from "express";
import { matchedData } from "express-validator";
import { brandService } from "../services";
import { helper } from "../utils";

const getBrands = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let result = await brandService.getBrands(req.query);
    helper.buildResponse(res, "Brands fetched Successfully", result);
  } catch (error) {
    next(error);
  }
};

const getBrandsByAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let result = await brandService.getBrandsByAdmin(req.query);
    helper.buildResponse(res, "Brands fetched Successfully", result);
  } catch (error) {
    next(error);
  }
};

const getBrand = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    let result = await brandService.getBrand(req.params.brandId);
    helper.buildResponse(res, "Brand fetched Successfully", result);
  } catch (error) {
    next(error);
  }
};

const addBrand = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    let result = await brandService.addBrand(matchedData(req));
    helper.buildResponse(res, "Brand saved successfully", result);
  } catch (error) {
    next(error);
  }
};

const updateBrand = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    let result = await brandService.updateBrand(req.params.brandId, matchedData(req));
    helper.buildResponse(res, "Brand updated Successfully", result);
  } catch (error) {
    next(error);
  }
};

const deleteBrand = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let result = await brandService.deleteBrand(req.params.brandId);
    helper.buildResponse(res, "Brand deleted successfully", result);
  } catch (error) {
    next(error);
  }
};

const updateStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let result = await brandService.updateStatus(req.params.brandId, req.body.isApproved);
    helper.buildResponse(res, "Brand status updated successfully", result);
  } catch (error) {
    next(error);
  }
};

export default {
  getBrands,
  getBrand,
  addBrand,
  updateBrand,
  deleteBrand,
  updateStatus,
  getBrandsByAdmin,
};
