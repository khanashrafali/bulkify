import { Res } from "tsoa";
import { bdProductModel, cartModel } from "../models";
import { helper } from "../utils";
import { IRequest } from "../utils/interfaces";
import adminService from "./admin.service";
import bdService from "./bd.service";
import productService from "./product.service";

helper.loadEnvFile();

const calculateShipCharge = async (cartTotal: number) => {
  let config = await adminService.getConfigInfo();
  let shippingCharge = 0;

  if (config.cartTotalPrice > 0) {
    if (cartTotal < config.cartTotalPrice) {
      shippingCharge = config.shippingCharge;
    }
  }

  return shippingCharge;
};

const getCartTotal = async (userId: string) => {
  try {
    let { items } = await bdService.getBDProducts(userId);
    let cartItems = await cartModel
      .find({ user: userId })
      .populate({ path: "product", select: "-variants" })
      .populate({ path: "vendor", select: "name" });

    const itemTotal = cartItems.reduce((amount: number, c: any) => {
      let total = 0;
      let existsInBDProduct = items.find((p:any) => {
        let item: any = p.toJSON();
        return item?.product?._id.toString() == c.product._id.toString();
      });
      if (existsInBDProduct) {
        total = c.quantity * (c.variant.sellingPrice - c.variant?.badalDaloPrice || 0) + amount;
      } else total = c.quantity * c.variant.sellingPrice + amount;
      return total;
    }, 0);

    const shippingCharges = 0;
    return {
      totalItem: cartItems?.length || 0,
      itemTotal,
      shippingCharges,
      total: itemTotal + shippingCharges,
    };
  } catch (error) {
    throw error;
  }
};

/**
 * check item is out of stock
 */
const checkOutOfStock = async (productId: string, variantId: string, quantity: number, isCart: boolean) => {
  let product = await productService.findProduct(productId);
  let productToJson: any = product.toJSON();
  let variant = productToJson.variants.find((v: any) => {
    return v._id.toString() == variantId.toString();
  });

  if (!variant) throw helper.buildError("Product not available!", 404);

  variant = { ...variant.variant, _id: variant._id };

  if (!isCart) return { product, variant, cartItemQuantity: quantity };
  if (variant.quantity < 1) throw helper.buildError("Out of stocks", 400);
  if (variant.quantity < quantity) {
    throw helper.buildError(`Out of stock`, 400);
  }

  return { product, variant, cartItemQuantity: quantity };
};

/**
 * add item into cart handler
 */
const addCartItem = async (
  req: IRequest,
  productId: string,
  variantId: string,
  quantity: number,
  throwExistsError: boolean = true
) => {
  try {
    let { variant, product } = await checkOutOfStock(productId, variantId, quantity, true);
    const cItem = await cartModel.findOne({
      product: productId,
      variant: variant,
      user: req.user._id,
    });
    if (cItem && !throwExistsError) return;
    if (cItem) throw helper.buildError("Item already added", 200);
    let productObj: any = product.toJSON();

    await cartModel.create({
      product: productId,
      vendor: productObj.vendor,
      variant,
      quantity,
      user: req.user._id,
    });
    return await getCartTotal(req.user._id);
  } catch (error) {
    throw error;
  }
};

/**
 * delete item from cart handler
 */
const deleteCartItem = async (req: IRequest, itemId: string) => {
  try {
    const cItem = await cartModel.findOne({ _id: itemId, user: req.user._id });
    if (!cItem) throw helper.buildError("No item found with this id", 404);
    await cItem.remove();
    return await getCartTotal(req.user._id);
  } catch (error) {
    throw error;
  }
};

/**
 * decrease item from cart handler
 */
const decreaseCartItem = async (req: IRequest, itemId: string) => {
  try {
    const cItem = await cartModel.findOne({ _id: itemId, user: req.user._id });
    if (!cItem) throw helper.buildError("No item found with this id", 404);
    let cItemToJson: any = cItem.toJSON();
    if (cItemToJson.quantity > 1) await cItem.set({ quantity: cItemToJson.quantity - 1 }).save();
    else await cItem.remove();

    return await getCartTotal(req.user._id);
  } catch (error) {
    throw error;
  }
};

/**
 * increase item from cart handler
 */
const increaseCartItem = async (req: IRequest, itemId: string) => {
  try {
    const cItem = await cartModel.findOne({ _id: itemId, user: req.user._id });
    if (!cItem) throw helper.buildError("No item found with this id", 404);
    let cItemToJson: any = cItem.toJSON();
    await checkOutOfStock(
      cItemToJson?.product?.toString(),
      cItemToJson?.variant?._id?.toString(),
      cItemToJson?.quantity + 1,
      true
    );
    await cItem.set({ quantity: cItemToJson.quantity + 1 }).save();
    return await getCartTotal(req.user._id);
  } catch (error) {
    throw error;
  }
};

/**
 * get cart handler
 */
const getCart = async (userId: string) => {
  try {
    let bdItems = await bdProductModel.find({ user: userId });

    let cartItems: any[] = await cartModel
      .find({ user: userId })
      .populate({ path: "product", match: { deleted: false } })
      .lean();

    let itemTotal = 0;

    cartItems = cartItems.filter((ci: any) => ci.product);

    cartItems = cartItems.filter((ci: any) => {
      let exists = ci.product.variants.find((v: any) => v._id.toString() == ci.variant._id.toString());
      return exists ? true : false;
    });

    cartItems = cartItems.map((c: any) => {
      c.isBadalDaloAvailable = false;
      c.isBadalDaloInfo = null;

      let amount = c.quantity * c.variant.sellingPrice;
      if (bdItems?.length) {
        let isExists = bdItems.find((w: any) => {
          return w.product.toString() == c.product._id.toString() && w.variant.toString() == c.variant._id.toString();
        });

        if (isExists) {
          c.isBadalDaloAvailable = true;
          c.isBadalDaloInfo = isExists;
          amount = c.quantity * c.variant.badalDaloPrice;
        }
      }

      c.totalQty = (c?.product?.variants || [])?.reduce((pv: any, cv: any) => pv + cv.variant.quantity, 0) || 0;

      let pVariant = (c?.product?.variants || [])?.find((v: any) => v._id.toString() == c.variant._id.toString());

      if (!pVariant) throw helper.buildError("Something went wrong", 400);

      c.variant = { ...pVariant.variant, _id: pVariant._id };

      itemTotal += amount;
      // delete c.product.variants;
      return c;
    });

    let shipCharge = await calculateShipCharge(itemTotal);

    return {
      items: cartItems,
      totalItem: cartItems?.length || 0,
      itemTotal,
      shippingCharges: shipCharge,
      total: itemTotal + shipCharge,
    };
  } catch (error) {
    await clearCart(userId);
    throw error;
  }
};

/**
 * clear cart handler
 */
const clearCart = async (userId: string) => {
  try {
    await cartModel.deleteMany({ user: userId });
    return await getCartTotal(userId);
  } catch (error) {
    throw error;
  }
};

/**
 * add items into cart handler
 */
const addCartItems = async (req: IRequest, items: any[]) => {
  try {
    for await (let item of items) {
      await addCartItem(req, item.productId, item.variantId, item.quantity, false);
    }
    return await getCartTotal(req.user._id);
  } catch (error) {
    throw error;
  }
};

export default {
  addCartItem,
  deleteCartItem,
  decreaseCartItem,
  increaseCartItem,
  getCart,
  clearCart,
  checkOutOfStock,
  addCartItems,
  getCartTotal,
};
