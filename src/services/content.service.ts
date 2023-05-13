import validator from "validator";
import { contentModel } from "../models";
import { helper } from "../utils";

helper.loadEnvFile();

/**
 * create content handler
 */
const addContent = async (body: any) => {
  try {
    const { title, subTitle, sortDescription, description } = body;
    let content = await contentModel.findOne({
      title: { $regex: new RegExp(`^${helper.regxEscape(title)}$`), $options: "i" },
    });
    let obj = { title, subTitle, sortDescription, description };
    if (content) throw helper.buildError("Same content title already exists.");
    await contentModel.create(obj);
  } catch (error) {
    throw error;
  }
};

/**
 * update content handler
 */
const updateContent = async (contentIdOrSlug: string, body: any) => {
  try {
    let id = validator.isMongoId(contentIdOrSlug) ? { _id: contentIdOrSlug } : { slug: contentIdOrSlug };
    const { title, subTitle, sortDescription, description, appDescription } = body;
    let obj = { title, subTitle, sortDescription, description, appDescription };
    let existing = await contentModel.findOne(id);
    if (!existing) throw helper.buildError("no content found with this id/slug", 404);

    let content = await contentModel.findOne({
      title: { $regex: new RegExp(`^${helper.regxEscape(title)}$`), $options: "i" },
      _id: { $ne: existing._id },
    });

    if (content) throw helper.buildError("Same content title already exists.");
    await existing.set(obj).save();
  } catch (error) {
    throw error;
  }
};

/**
 * get content handler
 */
const getContent = async (contentIdOrSlug: string) => {
  try {
    let id = validator.isMongoId(contentIdOrSlug) ? { _id: contentIdOrSlug } : { slug: contentIdOrSlug };
    let content = await contentModel.findOne(id).lean();
    if (!content) throw helper.buildError("No content found with this id", 404);
    return content;
  } catch (error) {
    throw error;
  }
};

/**
 * delete content handler
 */
const deleteContent = async (contentIdOrSlug: string) => {
  try {
    let id = validator.isMongoId(contentIdOrSlug) ? { _id: contentIdOrSlug } : { slug: contentIdOrSlug };
    let content: any = await contentModel.findOne(id);
    if (!content) throw helper.buildError("No content found with this id", 404);
    await content.delete();
  } catch (error) {
    throw error;
  }
};

/**
 * get content list handler
 */
const getContents = async (queryParams: any) => {
  try {
    let docs = [];
    let conditions: any = {};
    const pageInfo = helper.checkPagination(queryParams);

    if ("createdAt" in queryParams) conditions.date = queryParams.createdAt;

    if (queryParams.textSearch?.length) {
      conditions["$or"] = [
        { title: { $regex: helper.regxEscape(queryParams.textSearch), $options: "i" } },
        { subTitle: { $regex: helper.regxEscape(queryParams.textSearch), $options: "i" } },
        { sortDescription: { $regex: helper.regxEscape(queryParams.textSearch), $options: "i" } },
      ];
    }

    const count = await contentModel.countDocuments(conditions);
    let mongoQuery = contentModel.find(conditions);

    if (pageInfo) docs = await mongoQuery.skip(pageInfo.skip).limit(pageInfo.pageSize);
    else docs = await mongoQuery;

    return helper.makePaginatedData(docs, count, pageInfo);
  } catch (error) {
    throw error;
  }
};

export default {
  addContent,
  updateContent,
  getContent,
  deleteContent,
  getContents,
};
