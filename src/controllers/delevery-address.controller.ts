import { NextFunction, Request, Response } from "express";
import { deleveryService } from "../services";
import { helper } from "../utils";

const addDeleveryAddress = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let result = await deleveryService.addDeleveryAddress(req.body);
    return helper.buildResponse(res, "Location Added", result);
  } catch (error) {
    next(error);
  }
};

const updateDeleveryAddress = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let result = await deleveryService.updateDeleveryAddress(req.params.id, req.body);
    return helper.buildResponse(res, "Location Updated", result);
  } catch (error) {
    next(error);
  }
};

const getDeleveryAddress = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let result = await deleveryService.getDeleveryAddress(req.params.id);
    return helper.buildResponse(res, "Fetched Location", result);
  } catch (error) {
    next(error);
  }
};

const getDeleveryAddresses = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let result = await deleveryService.getDeleveryAddresses(req.query);
    return helper.buildResponse(res, "Fetched Addresses", result);
  } catch (error) {
    next(error);
  }
};

const deleteDeleveryAddress = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let result = await deleveryService.deleteDeleveryAddress(req.params.id);
    return helper.buildResponse(res, "Location Deleted", result);
  } catch (error) {
    next(error);
  }
};

const uploadAddress = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let result = await deleveryService.uploadAddress(req.body.locations);
    return helper.buildResponse(res, "Locations Added", result);
  } catch (error) {
    next(error);
  }
};

export default {
  addDeleveryAddress,
  updateDeleveryAddress,
  getDeleveryAddress,
  getDeleveryAddresses,
  deleteDeleveryAddress,
  uploadAddress,
};
