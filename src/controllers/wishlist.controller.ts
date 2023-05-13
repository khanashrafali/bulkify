import { NextFunction, Request, Response } from "express";
import { wishlistService } from "../services";
import { helper } from "../utils";
import { IRequest } from "../utils/interfaces";

/**
 * add item to cart api
 */
const addWishlistItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    let result = await wishlistService.addWishlistItem(req as IRequest, req.body.productId);
    helper.buildResponse(res, `Item ${result.isAdded ? "added to" : "removed from"} Wishlist`, result.newItem);
  } catch (error) {
    next(error);
  }
};

/**
 * delete item from cart api
 */
const deleteWishlistItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    await wishlistService.deleteWishlistItem(req as IRequest, req.params.itemId);
    helper.buildResponse(res, "Item deleted from Wishlist");
  } catch (error) {
    next(error);
  }
};

/**
 * get user cart api
 */
const getWishlist = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    let result = await wishlistService.getWishlist(req as IRequest);
    helper.buildResponse(res, "Wishlist fetched successfully", result);
  } catch (error) {
    next(error);
  }
};

/**
 * clear user cart api
 */
const clearWishlist = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    await wishlistService.clearWishlist(req as IRequest);
    helper.buildResponse(res, "Wishlist cleared successully");
  } catch (error) {
    next(error);
  }
};

/**
 * add items to cart api
 */
const addWishlistItems = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    await wishlistService.addWishlistItems(req as IRequest, req.body.items);
    helper.buildResponse(res, "Items added To Wishlist");
  } catch (error) {
    next(error);
  }
};

export default {
  addWishlistItem,
  deleteWishlistItem,
  getWishlist,
  clearWishlist,
  addWishlistItems,
};
