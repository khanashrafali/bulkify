import { NextFunction, Request, Response } from "express";
import { adsService } from "../services";
import { helper } from "../utils";

const getAdss = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log('cdscvdsvdsvdsvdvdvdvd>')
    let result = await adsService.getAdss(req.query);
    helper.buildResponse(res, "Ads fetched Successfully", result);
  } catch (error) {
    next(error);
  }
};

const getAds = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log('dvdsds')
    let result = await adsService.getAds(req.params.adsId);
    helper.buildResponse(res, "Ads fetched Successfully", result);
  } catch (error) {
    next(error);
  }
};

const addAds = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    helper.checkPayloadFiles(req);
    let result = await adsService.addAds(req.body, req.file);
    helper.buildResponse(res, "Ads saved successfully", result);
  } catch (error) {
    next(error);
  }
};

const updateAds = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    let result = await adsService.updateAds(req.params.adsId, req.body, req.file);
    helper.buildResponse(res, "Ads updated Successfully", result);
  } catch (error) {
    next(error);
  }
};

const deleteAds = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let result = await adsService.deleteAds(req.params.adsId);
    helper.buildResponse(res, "Ads deleted successfully", result);
  } catch (error) {
    next(error);
  }
};

export default {
  getAdss,
  getAds,
  addAds,
  updateAds,
  deleteAds,
};
