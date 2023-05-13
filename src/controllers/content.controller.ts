import { NextFunction, Request, Response } from "express";
import { contentService } from "../services";
import { helper } from "../utils";

/**
 * add content
 */
const addContent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    await contentService.addContent(req.body);
    helper.buildResponse(res, "Content added successfully");
  } catch (error) {
    next(error);
  }
};

/**
 * update content
 */
const updateContent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    await contentService.updateContent(req.params.contentIdOrSlug, req.body);
    helper.buildResponse(res, "Content updated successfully");
  } catch (error) {
    next(error);
  }
};
/**
 * delete content api
 */
const deleteContent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    const result = await contentService.deleteContent(req.params.contentIdOrSlug);
    helper.buildResponse(res, "Content deleted successfully", result);
  } catch (error) {
    next(error);
  }
};

/**
 * get content api
 */
const getContent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    const result = await contentService.getContent(req.params.contentIdOrSlug);
    helper.buildResponse(res, "Content fetched successfully", result);
  } catch (error) {
    next(error);
  }
};

/**
 * get content list api
 */
const getContents = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    const result = await contentService.getContents(req.query);
    helper.buildResponse(res, "Content fetched successfully", result);
  } catch (error) {
    next(error);
  }
};

export default {
  addContent,
  updateContent,
  getContent,
  deleteContent,
  getContents,
};
