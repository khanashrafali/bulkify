import validator from "validator";
import { collectionModel } from "../models";
import { helper } from "../utils";
import { IRequest } from "../utils/interfaces";

helper.loadEnvFile();

/**
 * get collection by id/slug handler
 */
const fetchCollection = async (collectionIdOrSlug: string) => {
  let condition: any = {};
  let isId = false;

  if (validator.isMongoId(collectionIdOrSlug.toString())) (isId = true), (condition._id = collectionIdOrSlug);
  else condition.slug = collectionIdOrSlug;

  const fetchedCol = await collectionModel.findOne(condition);
  if (!fetchedCol) throw helper.buildError(`No collection found with this ${isId ? "id" : "slug"}`, 404);

  return fetchedCol;
};

/**
 * create collection handler
 */
const addCollection = async (req: IRequest, body: any) => {
  try {
    const { title, description, type, chartImage, image, mustMatchAll, conditions } = body;
    await collectionModel.create({ title, description, type, chartImage, image, mustMatchAll, conditions, createdBy: req.user._id });
  } catch (error) {
    throw error;
  }
};

/**
 * update collection handler
 */
const updateCollection = async (req: IRequest, colId: string, body: any) => {
  try {
    const { title, description, type, chartImage, image, mustMatchAll, conditions } = body;
    const col = await fetchCollection(colId);
    await col.set({ title, description, type, chartImage, image, mustMatchAll, conditions }).save();
  } catch (error) {
    throw error;
  }
};

/**
 * delete collection handler
 */
const deleteCollection = async (req: IRequest, colId: string) => {
  try {
    await (await fetchCollection(colId))?.delete();
  } catch (error) {
    throw error;
  }
};

/**
 * get collection by id handler
 */
const getCollection = async (colId: string) => {
  try {
    return await fetchCollection(colId);
  } catch (error) {
    throw error;
  }
};

/**
 * get collection list handler
 */
const getCollections = async (queryParams: any) => {
  try {
    let conditions: any = {};
    const pageInfo = helper.checkPagination(queryParams);

    if (queryParams.textSearch?.length) conditions.title = { $regex: helper.regxEscape(queryParams.textSearch), $options: "i" };
    if ("status" in queryParams) conditions.status = queryParams.status;
    if ("createdAt" in queryParams) conditions.date = queryParams.createdAt;
    if ("isFeatured" in queryParams) conditions.isFeatured = queryParams.isFeatured;

    const count = await collectionModel.countDocuments(conditions);
    const mongoQuery = collectionModel.find(conditions).sort({ createdAt: -1 });
    let docs: any[] = [];

    if (pageInfo) docs = await mongoQuery.skip(pageInfo.skip).limit(pageInfo.pageSize);
    else docs = await mongoQuery;

    return helper.makePaginatedData(docs, count, pageInfo);
  } catch (error) {
    throw error;
  }
};

/**
 * get collection list by admin handler
 */
const getCollectionsByAdmin = async (queryParams: any) => {
  try {
    let conditions: any = {};
    const pageInfo = helper.checkPagination(queryParams);

    if (queryParams.textSearch?.length) conditions.title = { $regex: helper.regxEscape(queryParams.textSearch), $options: "i" };
    if ("status" in queryParams) conditions.status = queryParams.status;
    if ("createdAt" in queryParams) conditions.date = queryParams.createdAt;
    if ("isFeatured" in queryParams) conditions.isFeatured = queryParams.isFeatured;

    const count = await collectionModel.countDocuments(conditions);
    const mongoQuery = collectionModel.find(conditions).sort({ createdAt: -1 });
    let docs: any[] = [];

    if (pageInfo) docs = await mongoQuery.skip(pageInfo.skip).limit(pageInfo.pageSize);
    else docs = await mongoQuery;
    return helper.makePaginatedData(docs, count, pageInfo);
  } catch (error) {
    throw error;
  }
};

/**
 * update collection status handler
 */
const updateCollectionStatus = async (colId: string, status: boolean) => {
  try {
    await (await fetchCollection(colId)).set({ status }).save();
  } catch (error) {
    throw error;
  }
};

/**
 * update collection featured status handler
 */
const updateCollectionFeaturedStatus = async (colId: string, isFeatured: boolean) => {
  try {
    await (await fetchCollection(colId)).set({ isFeatured }).save();
  } catch (error) {
    throw error;
  }
};

export default {
  fetchCollection,
  addCollection,
  updateCollection,
  deleteCollection,
  getCollection,
  getCollections,
  getCollectionsByAdmin,
  updateCollectionStatus,
  updateCollectionFeaturedStatus,
};
