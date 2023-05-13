import { mainCategoryModel } from "../models";
import { helper } from "../utils";

helper.loadEnvFile();

/**
 * create main category handler
 */
const createMainCategory = async (name: string, status: boolean, image: string) => {
  try {
    return await mainCategoryModel.create({ name, status, image });
  } catch (error) {
    throw error;
  }
};

/**
 * update main category handler
 */
const updateMainCategory = async (categoryId: string, name: string, status: boolean, image: string) => {
  try {
    let data: any = { name, status };
    if (image) data.image = image;
    const category = await mainCategoryModel.findById(categoryId);
    if (!category) throw helper.buildError("No category found with this id", 404);
    return await category.set(data).save();
  } catch (error) {
    throw error;
  }
};

/**
 * get single main category handler
 */
const getMainCategory = async (categoryId: string) => {
  try {
    const category = await mainCategoryModel.findOne({ _id: categoryId });
    if (!category) throw helper.buildError("No category found with this id", 404);
    return category;
  } catch (error) {
    throw error;
  }
};

/**
 * get main categories by admin handler
 */
const getMainCategoriesByAdmin = async (queryParams: any) => {
  try {
    let { textSearch, status, createdAt } = queryParams;
    let condition: any = {};
    const pageInfo = helper.checkPagination(queryParams);

    if (textSearch && textSearch?.length) condition.name = { $regex: helper.regxEscape(textSearch), $options: "i" };
    if (status) condition.status = status;
    if (createdAt) condition.date = createdAt;
    const count = await mainCategoryModel.countDocuments(condition);
    let docs: any[] = [];
    const mongoQuery = mainCategoryModel.find(condition).sort({ slug: 1 });

    if (pageInfo) docs = await mongoQuery.skip(pageInfo.skip).limit(pageInfo.pageSize);
    else docs = await mongoQuery;

    return helper.makePaginatedData(docs, count, pageInfo);
  } catch (error) {
    throw error;
  }
};

/**
 * get main categories handler
 */
const getMainCategories = async (queryParams: any) => {
  try {
    let { textSearch, status, createdAt } = queryParams;
    let condition: any = { status: true };
    const pageInfo = helper.checkPagination(queryParams);

    if (textSearch && textSearch?.length) condition.name = { $regex: helper.regxEscape(textSearch), $options: "i" };
    if (status) condition.status = status;
    if (createdAt) condition.date = createdAt;
    const count = await mainCategoryModel.countDocuments(condition);
    let docs: any[] = [];
    const mongoQuery = mainCategoryModel.find(condition).sort({ name: 1 });

    if (pageInfo) docs = await mongoQuery.skip(pageInfo.skip).limit(pageInfo.pageSize);
    else docs = await mongoQuery;

    return helper.makePaginatedData(docs, count, pageInfo);
  } catch (error) {
    throw error;
  }
};

/**
 * delete main category handler
 */
const deleteMainCategory = async (categoryId: string) => {
  try {
    let category = await mainCategoryModel
      .findOne({ _id: categoryId })
      .populate({ path: "subCategories", match: { status: true } });
    if (!category) throw helper.buildError("No category found with this id", 404);
    const catToJSON: any = category.toJSON();

    if (catToJSON.status)
      throw helper.buildError("You are not allowed to delete this category as status is active", 400);
    if (catToJSON.subCategories?.length) throw helper.buildError("Please delete all the sub categories first", 400);
    return await category.delete();
  } catch (error) {
    throw error;
  }
};

/**
 * create sub category handler
 */
const createSubCategory = async (mainCategoryId: string, name: string, status: boolean, image: string) => {
  try {
    let mainCat = await mainCategoryModel.findById(mainCategoryId);
    if (!mainCat) throw helper.buildError("No main category found with this id", 404);

    const mainCatToJson: any = mainCat.toJSON();
    await mainCategoryModel.create({ name, status, image });
  } catch (error) {
    throw error;
  }
};

/**
 * update sub/main category status handler
 */
const updateCategoryStatus = async (categoryId: string, status: boolean) => {
  try {
    let category = await mainCategoryModel.findOne({ _id: categoryId });
    if (!category) throw helper.buildError("No category found with this id", 404);
    return await category.set({ status }).save();
  } catch (error) {
    throw error;
  }
};

export default {
  createMainCategory,
  updateMainCategory,
  getMainCategory,
  getMainCategories,
  deleteMainCategory,
  createSubCategory,
  updateCategoryStatus,
  getMainCategoriesByAdmin,
};
