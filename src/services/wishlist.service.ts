import { wishlistModel } from "../models";
import { helper } from "../utils";
import { IRequest } from "../utils/interfaces";
import cartService from "./cart.service";
import productService from "./product.service";

helper.loadEnvFile();

/**
 * add item into cart handler
 */
const addWishlistItem = async (req: IRequest, productId: string) => {
  try {
    let newItem;
    let isAdded;
    const cItem = await wishlistModel.findOne({ product: productId, user: req.user._id });
    if (cItem) {
      await cItem.remove();
      isAdded = false;
    } else {
      newItem = await wishlistModel.create({ product: productId, user: req.user._id });
      isAdded = true;
    }
    return { newItem, isAdded };
  } catch (error) {
    throw error;
  }
};

/**
 * delete item from cart handler
 */
const deleteWishlistItem = async (req: IRequest, itemId: string) => {
  try {
    const cItem = await wishlistModel.findOne({ _id: itemId, user: req.user._id });
    if (!cItem) throw helper.buildError("No item found with this id", 404);
    await cItem.remove();
  } catch (error) {
    throw error;
  }
};

/**
 * get cart handler
 */
const getWishlist = async (req: IRequest) => {
  try {
    let { items: cartItems } = await cartService.getCart(req.user._id);
    let items = await wishlistModel
      .find({ user: req.user._id })
      .populate({ path: "product", match: { deleted: false } });

    items = items.filter((wi: any) => wi.product);

    return {
      items: items.map((wi: any) => {
        let isExists = cartItems.find((ci) => {
          return ci.product?._id.toString() == wi.product?._id.toString();
        });
        let wiObj: any = wi.toJSON();
        if (isExists) wiObj.product.isInCart = true;
        else wiObj.product["isInCart"] = false;

        wiObj.totalQty = wiObj.product.variants.reduce((pv: any, cv: any) => pv + cv.variant.quantity, 0);
        return wiObj;
      }),
    };
  } catch (error) {
    throw error;
  }
};

/**
 * clear cart handler
 */
const clearWishlist = async (req: IRequest) => {
  try {
    await wishlistModel.deleteMany({ user: req.user._id });
  } catch (error) {
    throw error;
  }
};

/**
 * add items into cart handler
 */
const addWishlistItems = async (req: IRequest, items: any[]) => {
  try {
    for await (let item of items) await addWishlistItem(req, item.productId);
  } catch (error) {
    throw error;
  }
};

export default {
  addWishlistItem,
  deleteWishlistItem,
  getWishlist,
  clearWishlist,
  addWishlistItems,
};
