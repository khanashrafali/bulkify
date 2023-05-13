import { NextFunction, Request, Response } from "express";
import { matchedData } from "express-validator";
import { addressService } from "../services";
import { helper } from "../utils";
import { IRequest } from "../utils/interfaces";

/**
 * get user addresses api
 */
const getAddresses = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let result = await addressService.getAddresses(req as IRequest);
    helper.buildResponse(res, "Addresses fetched Successfully", { addressList: result });
  } catch (error) {
    next(error);
  }
};

/**
 * get user address api
 */
const getAddress = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let result = await addressService.getAddress(req as IRequest, req.params.addressId);
    helper.buildResponse(res, "Address fetched Successfully", result);
  } catch (error) {
    next(error);
  }
};

/**
 * post save user address api
 */
const postSaveAddress = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    let result = await addressService.saveAddress(req as IRequest, req.body);
    helper.buildResponse(res, "Address saved successfully", result);
  } catch (error) {
    next(error);
  }
};

/**
 * post save user address api
 */
const putUpdateAddress = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    let result = await addressService.updateAddress(req as IRequest, req.params.addressId, matchedData(req));
    helper.buildResponse(res, "Address updated Successfully", result);
  } catch (error) {
    next(error);
  }
};

/**
 * delete user address api
 */
const deleteAddress = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let result = await addressService.deleteAddress(req as IRequest, req.params.addressId);
    helper.buildResponse(res, "Address deleted successfully", result);
  } catch (error) {
    next(error);
  }
};

/**
 * make default user address api
 */
const putSetDefaultAddress = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let result = await addressService.makeDefaultAddress(req as IRequest, req.params.addressId);
    helper.buildResponse(res, "Address make dafault successfully", result);
  } catch (error) {
    next(error);
  }
};

export default {
  getAddress,
  postSaveAddress,
  getAddresses,
  putUpdateAddress,
  deleteAddress,
  putSetDefaultAddress,
};
