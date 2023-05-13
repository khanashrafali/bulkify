import { NextFunction, Request, Response } from "express";
import { cartService } from "../services";
import { helper } from "../utils";
import { IRequest } from "../utils/interfaces";

/**
 * add item to cart api
 */
const postAddCartItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    let result = await cartService.addCartItem(
      req as IRequest,
      req.body.productId,
      req.body.variantId,
      req.body.quantity
    );
    helper.buildResponse(res, "Item added To Cart", result);
  } catch (error) {
    next(error);
  }
};

/**
 * remove item from cart api
 */
const putDecreaseItemQuantity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    await cartService.decreaseCartItem(req as IRequest, req.params.itemId);
    helper.buildResponse(res, "Item removed from Cart");
  } catch (error) {
    next(error);
  }
};

/**
 * add item to cart api
 */
const putIncreaseItemQuantity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    await cartService.increaseCartItem(req as IRequest, req.params.itemId);
    helper.buildResponse(res, "Item added to Cart");
  } catch (error) {
    next(error);
  }
};

/**
 * delete item from cart api
 */
const deleteCartItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    let result = await cartService.deleteCartItem(req as IRequest, req.params.itemId);
    helper.buildResponse(res, "Item deleted from Cart", result);
  } catch (error) {
    next(error);
  }
};

/**
 * get user cart api
 */
const getCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    let result = await cartService.getCart((req as IRequest).user._id);
    helper.buildResponse(res, "Cart fetched successfully", result);
  } catch (error) {
    next(error);
  }
};

/**
 * clear user cart api
 */
const getClearCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    await cartService.clearCart((req as IRequest).user._id);
    helper.buildResponse(res, "Cart cleared successully");
  } catch (error) {
    next(error);
  }
};

/**
 * add items to cart api
 */
const postAddCartItems = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    await cartService.addCartItems(req as IRequest, req.body.items);
    helper.buildResponse(res, "Items added To Cart");
  } catch (error) {
    next(error);
  }
};

export default {
  postAddCartItem,
  putDecreaseItemQuantity,
  putIncreaseItemQuantity,
  deleteCartItem,
  getCart,
  getClearCart,
  postAddCartItems,
};
