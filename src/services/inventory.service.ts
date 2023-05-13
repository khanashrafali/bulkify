import _ from "lodash";
import { productModel } from "../models";
import { helper } from "../utils";
import { IRequest } from "../utils/interfaces";

helper.loadEnvFile();

const updateProductStockData = async (productId: string, data: any) => {
  try {
    return await productModel.create({ ...data, variants: _.sortBy(data.variants, ["variant.mrp"]) });
  } catch (error) {
    throw error;
  }
};

export default {
  updateProductStockData,
};
