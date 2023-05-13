import { NextFunction, Request, Response } from "express";
import { collectionService } from "../services";
import { helper } from "../utils";
import { IRequest } from "../utils/interfaces";

/**
 * create collection api
 */
const postAddCollection = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    await collectionService.addCollection(req as IRequest, req.body);
    helper.buildResponse(res, "Collection created sucessfully");
  } catch (error) {
    next(error);
  }
};

/**
 * update collection api
 */
const putUpdateCollection = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    await collectionService.updateCollection(req as IRequest, req.params.collectionId, req.body);
    helper.buildResponse(res, "Collection updated sucessfully");
  } catch (error) {
    next(error);
  }
};

/**
 * delete collection api
 */
const deleteCollection = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    await collectionService.deleteCollection(req as IRequest, req.params.collectionId);
    helper.buildResponse(res, "Collection deleted sucessfully");
  } catch (error) {
    next(error);
  }
};

/**
 * get single collection api
 */
const getCollection = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    let result = await collectionService.getCollection(req.params.collectionId);
    helper.buildResponse(res, "Collection fetched sucessfully", result);
  } catch (error) {
    next(error);
  }
};

/**
 * get collection list api
 */
const getCollections = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    let result = await collectionService.getCollections(req.query);
    helper.buildResponse(res, "Collections fetched sucessfully", result);
  } catch (error) {
    next(error);
  }
};

/**
 * get collection list by admin api
 */
const getCollectionsByAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    let result = await collectionService.getCollectionsByAdmin(req.query);
    helper.buildResponse(res, "Collections fetched sucessfully", result);
  } catch (error) {
    next(error);
  }
};

/**
 * update collection status api
 */
const patchUpdateCollectionStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    const result = await collectionService.updateCollectionStatus(req.params.collectionId, req.body.status);
    helper.buildResponse(res, "Collection status updated sucessfully", result);
  } catch (error) {
    next(error);
  }
};

/**
 * update collection featured status api
 */
const patchUpdateCollectionFeaturedStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    const result = await collectionService.updateCollectionFeaturedStatus(req.params.collectionId, req.body.isFeatured);
    helper.buildResponse(res, "Collection status updated sucessfully", result);
  } catch (error) {
    next(error);
  }
};

export default {
  postAddCollection,
  putUpdateCollection,
  deleteCollection,
  getCollection,
  getCollections,
  getCollectionsByAdmin,
  patchUpdateCollectionStatus,
  patchUpdateCollectionFeaturedStatus,
};
