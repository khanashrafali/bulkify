import { variantModel } from "../models";
import { helper } from "../utils";

const populate = (query: any) => query.populate("categories");

const addVariant = async (body: any) => {
  try {
    return await variantModel.create(body);
  } catch (error) {
    throw error;
  }
};

const updateVariant = async (vid: string, body: any) => {
  try {
    let variant = await populate(variantModel.findOne({ _id: vid }));
    if (!variant) throw helper.buildError("no variant found with this id", 404);
    return await variant.set(body).save();
  } catch (error) {
    throw error;
  }
};

const updateVariantStatus = async (vid: string, status: boolean) => {
  try {
    let variant = await variantModel.findOne({ _id: vid });
    if (!variant) throw helper.buildError("no variant found with this id", 404);
    return await variant.set({ status }).save();
  } catch (error) {
    throw error;
  }
};

const getVariant = async (vid: string) => {
  try {
    let variant = await populate(variantModel.findOne({ _id: vid }));
    if (!variant) throw helper.buildError("no variant found with this id", 404);
    return variant;
  } catch (error) {
    throw error;
  }
};

const getVariants = async (queryParams: any) => {
  try {
    let pageInfo = helper.checkPagination(queryParams);
    let conditions: any = { values: { $ne: [] } };
    if ("status" in queryParams) conditions.status = queryParams.status;
    if ("category" in queryParams) conditions.categories = queryParams.category;
    let count = await variantModel.countDocuments(conditions);
    let docs: any[] = [];
    let mongoQuery = populate(variantModel.find(conditions));

    if (pageInfo) docs = await mongoQuery.skip(pageInfo.skip).limit(pageInfo.pageSize);
    else docs = await mongoQuery;

    return helper.makePaginatedData(docs, count, pageInfo);
  } catch (error) {
    throw error;
  }
};

const deleteVariant = async (vid: string) => {
  try {
    let variant = await populate(variantModel.findOne({ _id: vid }));
    if (!variant) throw helper.buildError("no variant found with this id", 404);
    return await variant.delete();
  } catch (error) {
    throw error;
  }
};

const getVariantByAdmin = async (vid: string) => {
  try {
    let variant = await populate(variantModel.findOne({ _id: vid }));
    if (!variant) throw helper.buildError("no variant found with this id", 404);
    return variant;
  } catch (error) {
    throw error;
  }
};

const getVariantsByAdmin = async (queryParams: any) => {
  try {
    let pageInfo = helper.checkPagination(queryParams);
    let conditions: any = { values: { $ne: [] } };
    if ("status" in queryParams) conditions.status = queryParams.status;
    if ("category" in queryParams) conditions.categories = queryParams.category;
    let count = await variantModel.countDocuments(conditions);
    let docs: any[] = [];
    let mongoQuery = populate(variantModel.find(conditions));

    if (pageInfo) docs = await mongoQuery.skip(pageInfo.skip).limit(pageInfo.pageSize);
    else docs = await mongoQuery;

    return helper.makePaginatedData(docs, count, pageInfo);
  } catch (error) {
    throw error;
  }
};

export default {
  addVariant,
  updateVariant,
  getVariant,
  getVariants,
  deleteVariant,
  updateVariantStatus,
  getVariantByAdmin,
  getVariantsByAdmin,
};
