import mongoose from "mongoose";
import validator from "validator";
import { orderModel, payoutModel } from "../models";
import { helper } from "../utils";
import { IRequest, PageInfo } from "../utils/interfaces";

helper.loadEnvFile();

// create payout
const postCreatePayout = async (req: IRequest, body: any) => {
  try {
    for (let payout of body.payouts) {
      await orderModel.updateOne({ _id: payout.order }, { $set: { payoutCompelete: true } });
    }
    return await payoutModel.insertMany(body.payouts);
  } catch (error) {
    throw error;
  }
};

// fetch payout
const getPayout = async (payoutId: string) => {
  try {
    return await payoutModel
      .findById(payoutId)
      .populate({ path: "order", populate: { path: "product" } })
      .populate({ path: "vendor", select: "name" });
  } catch (error) {
    throw error;
  }
};

// fetch payouts
const getPayouts = async (queryParams: any) => {
  try {
    let conditions: any = {};
    const pageInfo = helper.checkPagination(queryParams);
    if ("createdAt" in queryParams) conditions.date = queryParams.createdAt;
    let docs: any[] = [];
    let count = await payoutModel.countDocuments(conditions);
    let mongoQuery = payoutModel
      .find(conditions)
      .populate({ path: "order", populate: { path: "product" } })
      .populate({ path: "vendor", select: "name" });

    if (pageInfo) docs = await mongoQuery.skip(pageInfo.skip).limit(pageInfo.pageSize);
    else docs = await mongoQuery;

    return helper.makePaginatedData(docs, count, pageInfo);
  } catch (error) {
    throw error;
  }
};

export default {
  postCreatePayout,
  getPayout,
  getPayouts,
};
