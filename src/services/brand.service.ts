import { brandModel } from "../models";
import { helper } from "../utils";
import { IRequest } from "../utils/interfaces";

helper.loadEnvFile();

const addBrand = async (data: any) => {
  try {
    return await brandModel.create(data);
  } catch (error) {
    throw error;
  }
};

const getBrand = async (brandId: string) => {
  try {
    const oldBrand = await brandModel.findOne({ _id: brandId }).populate({ path: "categories", select: "name image" });
    if (!oldBrand) throw helper.buildError("No brand found with this id", 404);
    return oldBrand;
  } catch (error) {
    throw error;
  }
};

const getBrands = async (queryParams: any) => {
  try {
    let conditions: any = { isApproved: true };
    const pageInfo = helper.checkPagination(queryParams);

    if ("isApproved" in queryParams) conditions.isApproved = queryParams.isApproved;
    if ("category" in queryParams) conditions.categories = queryParams.category;

    let mongoQuery = brandModel
      .find(conditions)
      .sort({ brandName: 1 })
      .populate({ path: "categories", select: "name image" });

    const count = await brandModel.countDocuments(conditions);
    let docs: any[] = [];

    if (pageInfo) docs = await mongoQuery.skip(pageInfo.skip).limit(pageInfo.pageSize);
    else docs = await mongoQuery;

    return helper.makePaginatedData(docs, count, pageInfo);
  } catch (error) {
    throw error;
  }
};

const getBrandsByAdmin = async (queryParams: any) => {
  try {
    let conditions: any = {};
    const pageInfo = helper.checkPagination(queryParams);

    if ("isApproved" in queryParams) conditions.isApproved = queryParams.isApproved;
    if ("category" in queryParams) conditions.categories = queryParams.category;

    let mongoQuery = brandModel
      .find(conditions)
      .sort({ brandName: 1 })
      .populate({ path: "categories", select: "name image" });
    const count = await brandModel.countDocuments(conditions);
    let docs: any[] = [];

    if (pageInfo) docs = await mongoQuery.skip(pageInfo.skip).limit(pageInfo.pageSize);
    else docs = await mongoQuery;

    return helper.makePaginatedData(docs, count, pageInfo);
  } catch (error) {
    throw error;
  }
};

const updateBrand = async (brandId: string, data: any) => {
  try {
    const oldBrand = await brandModel.findOne({ _id: brandId });
    if (!oldBrand) throw helper.buildError("No brand found with this id", 404);
    await oldBrand.set(data).save();
  } catch (error) {
    throw error;
  }
};

const deleteBrand = async (brandId: string) => {
  try {
    const oldBrand = await brandModel.findOne({ _id: brandId });
    if (!oldBrand) throw helper.buildError("No brand found with this id", 404);
    return await oldBrand.remove();
  } catch (error) {
    throw error;
  }
};

const updateStatus = async (brandId: string, isApproved: boolean) => {
  try {
    let brand = await brandModel.findOne({ _id: brandId });
    if (!brand) throw helper.buildError("No brand found with this id", 404);
    await brand.set({ isApproved }).save();
  } catch (error) {
    throw error;
  }
};

export default {
  addBrand,
  getBrand,
  getBrands,
  updateBrand,
  deleteBrand,
  updateStatus,
  getBrandsByAdmin,
};
