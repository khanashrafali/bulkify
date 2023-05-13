import { NextFunction, Request, Response } from "express";
import { mainCatService } from "../services";
import { fileHandler, helper } from "../utils";
import { IRequest } from "../utils/interfaces";

/**
 * create main category api
 */
const postCreateMainCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    const result = await mainCatService.createMainCategory(req.body.name, req.body.status, req.body.image);
    helper.buildResponse(res, "Category created successfully", result);
  } catch (error) {
    next(error);
  }
};

/**
 * update main category api
 */
const putUpdateMainCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    const result = await mainCatService.updateMainCategory(
      req.params.categoryId,
      req.body.name,
      req.body.status,
      req.body.image
    );
    helper.buildResponse(res, "Category updated successfully", result);
  } catch (error) {
    next(error);
  }
};

/**
 * get single main category api
 */
const getMainCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    const result = await mainCatService.getMainCategory(req.params.categoryId);
    helper.buildResponse(res, "Category fetched successfully", result);
  } catch (error) {
    next(error);
  }
};

/**
 * get main category list by admin api
 */
const getMainCategoriesByAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    const result = await mainCatService.getMainCategoriesByAdmin(req.query);
    helper.buildResponse(res, "Categories fetched sucessfully", result);
  } catch (error) {
    next(error);
  }
};

/**
 * get main category list by user api
 */
const getMainCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    const result = await mainCatService.getMainCategories(req.query);
    helper.buildResponse(res, "Categories fetched sucessfully", result);
  } catch (error) {
    next(error);
  }
};

/**
 * delete main category api
 */
const deleteMainCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    const result = await mainCatService.deleteMainCategory(req.params.categoryId);
    helper.buildResponse(res, "Category deleted sucessfully", result);
  } catch (error) {
    next(error);
  }
};

/**
 * update category status api
 */
const patchUpdateCategoryStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    const result = await mainCatService.updateCategoryStatus(req.params.categoryId, req.body.status);
    helper.buildResponse(res, "Category status updated sucessfully", result);
  } catch (error) {
    next(error);
  }
};

export default {
  postCreateMainCategory,
  putUpdateMainCategory,
  getMainCategory,
  getMainCategories,
  deleteMainCategory,
  patchUpdateCategoryStatus,
  getMainCategoriesByAdmin,
};
