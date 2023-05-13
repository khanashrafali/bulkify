import { NextFunction, Request, Response } from "express";
import { matchedData } from "express-validator";
import { priceService } from "../services";
import { helper } from "../utils";
import { IRequest } from "../utils/interfaces";

const addPrice = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    let result = await priceService.addPrice(matchedData(req));
    helper.buildResponse(res, "Price Added Successfully.", result);
  } catch (error) {
    next(error);
  }
};

const updatePrice = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    let result = await priceService.updatePrice(req.params.priceId, matchedData(req));
    helper.buildResponse(res, "Price Updated Successfully.", result);
  } catch (error) {
    next(error);
  }
};

const getPrices = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    let result = await priceService.getPrices(req.query.categoryId);
    helper.buildResponse(res, "Fetched Prices Successfully.", result);
  } catch (error) {
    next(error);
  }
};

const deletePrice = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    let result = await priceService.deletePrice(req.params.priceId);
    helper.buildResponse(res, "Price Deleted Successfully.", result);
  } catch (error) {
    next(error);
  }
};

const fetchPrice = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    let result = await priceService.fetchPrice(req.params.priceId);
    helper.buildResponse(res, "Price Fetched Successfully.", result);
  } catch (error) {
    next(error);
  }
};

const fetchPriceByKey = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    let result = await priceService.fetchPriceByKey(req.params.key);
    helper.buildResponse(res, "Price Fetched Successfully.", result);
  } catch (error) {
    next(error);
  }
};

export default {
  addPrice,
  updatePrice,
  getPrices,
  fetchPrice,
  fetchPriceByKey,
  deletePrice,
};
