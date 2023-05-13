import { adsModel } from "../models";
import { helper } from "../utils";

helper.loadEnvFile();

const addAds = async (data: any, file: any) => {
  try {
    return await adsModel.create({
      ...data,
      file: {
        xlg: file.xlg.Location,
        lg: file.lg.Location,
        md: file.md.Location,
        sm: file.sm.Location,
        xs: file.xs.Location,
        original: file.original.Location,
      },
    });
  } catch (error) {
    throw error;
  }
};

const getAds = async (adsId: string) => {
  try {
    const oldBrand = await adsModel.findOne({ _id: adsId }).populate({
      path: "product",
      select: "name images",
    });
    if (!oldBrand) throw helper.buildError("No ads found with this id", 404);
    return oldBrand;
  } catch (error) {
    throw error;
  }
};

const getAdss = async (queryParams: any) => {
  try {
    let conditions: any = {};
    const pageInfo = helper.checkPagination(queryParams);

    if ("location" in queryParams) conditions.location = queryParams.location;

    let mongoQuery = adsModel.find(conditions).sort({ createdAt: -1 }).populate({
      path: "product",
      select: "name images",
    });
    const count = await adsModel.countDocuments(conditions);
    let docs: any[] = [];

    if (pageInfo) docs = await mongoQuery.skip(pageInfo.skip).limit(pageInfo.pageSize);
    else docs = await mongoQuery;

    return helper.makePaginatedData(docs, count, pageInfo);
  } catch (error) {
    throw error;
  }
};

const updateAds = async (adsId: string, data: any, file: any) => {
  try {
    const oldBrand = await adsModel.findOne({ _id: adsId });
    if (!oldBrand) throw helper.buildError("No ads found with this id", 404);

    if (file) {
      data.file = {
        xlg: file.xlg.Location,
        lg: file.lg.Location,
        md: file.md.Location,
        sm: file.sm.Location,
        xs: file.xs.Location,
        original: file.original.Location,
      };
    } else delete data.file;

    await oldBrand.set(data).save();
  } catch (error) {
    throw error;
  }
};

const deleteAds = async (adsId: string) => {
  try {
    const oldBrand = await adsModel.findOne({ _id: adsId });
    if (!oldBrand) throw helper.buildError("No ads found with this id", 404);
    return await oldBrand.remove();
  } catch (error) {
    throw error;
  }
};

export default {
  addAds,
  getAds,
  getAdss,
  updateAds,
  deleteAds,
};
