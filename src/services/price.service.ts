import { pricesModel } from "../models";
import { helper } from "../utils";

helper.loadEnvFile();

const addPrice = async (body: any) => {
  try {
    return await pricesModel.create(body);
  } catch (error) {
    throw error;
  }
};

const updatePrice = async (priceId: string, body: any) => {
  try {
    return await pricesModel.updateOne({ _id: priceId }, { $set: body });
  } catch (error) {
    throw error;
  }
};

const getPrices = async (queryParams: any) => {
  try {
    const pageInfo = helper.checkPagination(queryParams);
    const mongoQuery = pricesModel.find();
    let docs: any[] = [];
    const count = await pricesModel.countDocuments();

    if (pageInfo) docs = await mongoQuery.skip(pageInfo.skip).limit(pageInfo.pageSize);
    else docs = await mongoQuery;

    return helper.makePaginatedData(docs, count, pageInfo);
  } catch (error) {
    throw error;
  }
};

const deletePrice = async (priceId: string) => {
  try {
    return await pricesModel.deleteOne({ _id: priceId });
  } catch (error) {
    throw error;
  }
};

const fetchPrice = async (priceId: string) => {
  try {
    let price = await pricesModel.findOne({ _id: priceId });
    if (!price) throw helper.buildError("no price found with this id", 404);
    return price;
  } catch (error) {
    throw error;
  }
};

const fetchPriceByKey = async (key: string) => {
  try {
    let price = await pricesModel.findOne({ key });
    if (!price) throw helper.buildError("no price found with this id", 404);
    return price;
  } catch (error) {
    throw error;
  }
};

export default {
  addPrice,
  updatePrice,
  getPrices,
  deletePrice,
  fetchPrice,
  fetchPriceByKey,
};
