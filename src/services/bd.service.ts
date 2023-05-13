import { bdProductService } from ".";
import { bdProductModel, productModel } from "../models";
import { helper } from "../utils";
import { IRequest } from "../utils/interfaces";
import cartService from "./cart.service";

helper.loadEnvFile();

const addBDProduct = async (req: IRequest, product: string, variant: string, comment: string, file: string) => {
  try {
    const cItem = await bdProductModel.findOne({ product, variant, user: req.user._id });
    if (cItem) throw helper.buildError("Item already added", 200);
    await bdProductModel.create({ product, variant, comment, file, user: req.user._id });
  } catch (error) {
    throw error;
  }
};

const deleteDBProduct = async (userId: string, productId: string, variantId: string) => {
  try {
    const cItem = await bdProductModel.findOne({ product: productId, variant: variantId, user: userId });
    if (!cItem) throw helper.buildError("No item found with this id", 404);
    await cItem.remove();
  } catch (error) {
    throw error;
  }
};

const getBDProducts = async (userId: string) => {
  try {
    let items = await bdProductModel.find({ user: userId }).populate({ path: "product" });
    return { items };
  } catch (error) {
    throw error;
  }
};

const clearBDProducts = async (userId: string) => {
  try {
    let cartData = await cartService.getCart(userId);
    for await (let item of cartData.items) {
      await bdProductModel.deleteMany({
        product: item.product._id.toString(),
        variant: item.variant._id.toString(),
        user: userId,
      });
    }
  } catch (error) {
    throw error;
  }
};

export default {
  addBDProduct,
  deleteDBProduct,
  getBDProducts,
  clearBDProducts,
};
