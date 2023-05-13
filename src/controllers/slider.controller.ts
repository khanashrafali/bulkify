import { NextFunction, Request, Response } from "express";
import { sliderService } from "../services";
import { fileHandler, helper } from "../utils";
import { IRequest } from "../utils/interfaces";

/**
 * add slider data
 */
const addSlider = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    await sliderService.addSlider(req as IRequest, req.body);
    helper.buildResponse(res, "Slider added successfully");
  } catch (error) {
    next(error);
  }
};

/**
 * update slider data
 */
const updateSlider = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    await sliderService.updateSlider(req as IRequest, req.body);
    helper.buildResponse(res, "Slider updated successfully");
  } catch (error) {
    next(error);
  }
};

/**
 * delete slider slide
 */
const deleteSliderSlide = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    const result = await sliderService.deleteSliderSlide(req as IRequest, req.params.sliderId, req.params.slideId);
    helper.buildResponse(res, "Slide deleted successfully", result);
  } catch (error) {
    next(error);
  }
};

/**
 * delete slider
 */
const deleteSlider = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    const result = await sliderService.deleteSlider(req as IRequest, req.params.sliderId);
    helper.buildResponse(res, "Slider deleted successfully", result);
  } catch (error) {
    next(error);
  }
};

/**
 * get Slider
 */
const getSlider = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await sliderService.getSlider(req.query);
    helper.buildResponse(res, "Slider Info fetched successfully", result);
  } catch (error) {
    next(error);
  }
};

export default {
  addSlider,
  updateSlider,
  getSlider,
  deleteSliderSlide,
  deleteSlider,
};
