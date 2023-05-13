import { NextFunction, Request, Response } from "express";
import { matchedData } from "express-validator";
import { vendorService } from "../services";
import { fileHandler, helper } from "../utils";
import { IRequest } from "../utils/interfaces";

/**
 * create vendor api
 */
const addVendor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    await vendorService.addVendor(req as IRequest, req.body, res);
  } catch (error) {
    next(error);
  }
};

/**
 * update vendor api
 */
const updateVendor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    let fileObj: any = req.files;
    await vendorService.updateVendor(req.params.vendorId, req.body);
    helper.buildResponse(res, "Vendor details updated successfully");
  } catch (error) {
    next(error);
  }
};

/**
 * update vendor api
 */
const updateVendorProfile = async (req: Request, res: Response, next: NextFunction) => {
  let avatar: any;
  try {
    helper.handlePayloadError(req);
    await vendorService.updateVendor((req as IRequest).user._id.toString(), req.body);
    helper.buildResponse(res, "Vendor details updated successfully");
  } catch (error) {
    next(error);
  }
};

/**
 * delete vendor api
 */
const deleteVendor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    const result = await vendorService.deleteVendor(req.params.vendorId);
    helper.buildResponse(res, "Vendor deleted successfully", result);
  } catch (error) {
    next(error);
  }
};

/**
 * get single vendor api
 */
const getVendor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    const result = await vendorService.getVendor(req.params.vendorId);
    helper.buildResponse(res, "Vendor fetched successfully", result);
  } catch (error) {
    next(error);
  }
};

/**
 * get vendor list api
 */
const getVendors = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await vendorService.getVendors(req.query);
    helper.buildResponse(res, "Vendors fetched successfully", result);
  } catch (error) {
    next(error);
  }
};

/**
 * get vendor list by admin api
 */
const getVendorsByAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await vendorService.getVendorsByAdmin(req.query);
    helper.buildResponse(res, "Vendors fetched successfully", result);
  } catch (error) {
    next(error);
  }
};

/**
 * update vendor status api
 */
const updateVendorStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    const result = await vendorService.updateVendorStatus(req.params.vendorId, req.body.status);
    helper.buildResponse(res, "Vendor status updated successfully", result);
  } catch (error) {
    next(error);
  }
};

/**
 * update vendor status api
 */
const patchUpdateApproval = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    const result = await vendorService.updateVendorApproval(req.params.vendorId, req.body.isApproved);
    helper.buildResponse(res, "Vendor status updated successfully", result);
  } catch (error) {
    next(error);
  }
};

/**
 * complete vendor profile api
 */
const completeVendorProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    let fileObj: any = req.files;
    await vendorService.completeVendorProfile(req as IRequest, fileObj, req.body, res);
  } catch (error) {
    next(error);
  }
};

/**
 * became A Vendor
 */
const becameAVendor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    let fileObj: any = req.files;
    await vendorService.becameAVendor(req as IRequest, fileObj, matchedData(req), res);
  } catch (error) {
    next(error);
  }
};

const generateNewPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    await vendorService.generateNewPassword(req.params.vendorId, res);
  } catch (error) {
    next(error);
  }
};

export default {
  addVendor,
  updateVendor,
  getVendor,
  getVendors,
  deleteVendor,
  getVendorsByAdmin,
  updateVendorStatus,
  completeVendorProfile,
  patchUpdateApproval,
  becameAVendor,
  updateVendorProfile,
  generateNewPassword,
};
