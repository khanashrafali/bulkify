import { NextFunction, Request, Response } from "express";
import { categoryService } from "../services";
import { helper } from "../utils";
import { IRequest } from "../utils/interfaces";

/**
 * create main category api
 */
const postCreateMainCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    const result = await categoryService.createMainCategory(
      req.body.name,
      req.body.status,
      req.body.image,
      (req as IRequest).user._id
    );
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
    const result = await categoryService.updateMainCategory(
      req.params.mainCategoryId,
      req.body.name,
      req.body.status,
      req.body.image,
      req.body.collectionIds
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
    const result = await categoryService.getMainCategory(req.params.mainCategoryId);
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
    const result = await categoryService.getMainCategoriesByAdmin(req.query);
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
    const result = await categoryService.getMainCategories(req.query);
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
    const result = await categoryService.deleteMainCategory(req.params.mainCategoryId);
    helper.buildResponse(res, "Category deleted sucessfully", result);
  } catch (error) {
    next(error);
  }
};

/**
 * create sub category api
 */
const postCreateSubCategory = async (req: Request, res: Response, next: NextFunction) => {
  const image = (req?.file as any)?.Location;
  try {
    helper.handlePayloadError(req);
    const result = await categoryService.createSubCategory(
      req.params.mainCategoryId,
      req.body.name,
      req.body.status,
      req.body.image,
      req.body.collectionIds,
      (req as IRequest).user._id
    );
    helper.buildResponse(res, "Sub category created sucessfully", result);
  } catch (error) {
    next(error);
  }
};

/**
 * update sub category api
 */
const putUpdateSubCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    const result = await categoryService.updateSubCategory(req.body.subCategoryId, req.body);
    helper.buildResponse(res, "Sub category updated sucessfully", result);
  } catch (error) {
    next(error);
  }
};

/**
 * get single sub category api
 */
const getSubCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    const result = await categoryService.getSubCategory(req.params.subCategoryId);
    helper.buildResponse(res, "Sub category fetched sucessfully", result);
  } catch (error) {
    next(error);
  }
};

/**
 * get sub category list by admin api
 */
const getSubCategoriesByAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    const result = await categoryService.getSubCategoriesByAdmin(req.params.mainCategoryId, req.query);
    helper.buildResponse(res, "Sub categories fetched sucessfully", result);
  } catch (error) {
    next(error);
  }
};

/**
 * get sub category list api
 */
const getSubCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    const result = await categoryService.getSubCategories(req.params.mainCategoryId, req.query);
    helper.buildResponse(res, "Sub categories fetched sucessfully", result);
  } catch (error) {
    next(error);
  }
};

/**
 * delete sub category api
 */
const deleteSubCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    const result = await categoryService.deleteSubCategory(req.params.subCategoryId);
    helper.buildResponse(res, "Sub category deleted sucessfully", result);
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
    const result = await categoryService.updateCategoryStatus(req.params.categoryId, req.body.status);
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
  postCreateSubCategory,
  putUpdateSubCategory,
  getSubCategory,
  getSubCategories,
  deleteSubCategory,
  patchUpdateCategoryStatus,
  getMainCategoriesByAdmin,
  getSubCategoriesByAdmin,
};
