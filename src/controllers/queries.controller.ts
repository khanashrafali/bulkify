import { NextFunction, Request, Response } from "express";
import { queriesService, wishlistService } from "../services";
import { helper } from "../utils";
import { IRequest } from "../utils/interfaces";

/**
 * add item to cart api
 */
const saveQueiry = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    let result = await queriesService.saveQueiry(req.body);
    helper.buildResponse(res, "Query saved successfully", result);
  } catch (error) {
    next(error);
  }
};

const getQueries = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    let result = await queriesService.getQueries(req.query);
    helper.buildResponse(res, "Query fetched Successfully.", result);
  } catch (error) {
    next(error);
  }
};

const getQuery = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    let result = await queriesService.getQuery(req.params.id);
    helper.buildResponse(res, "Query fetched Successfully.", result);
  } catch (error) {
    next(error);
  }
};

export default {
  saveQueiry,
  getQueries,
  getQuery,
};
