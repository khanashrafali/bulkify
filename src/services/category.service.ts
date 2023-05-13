import { categoryModel, mainCategoryModel } from "../models";
import { helper } from "../utils";

helper.loadEnvFile();

// fetch category stages
const categoryStages = async (query: any, isAdmin: boolean = false) => {
  try {
    let conditions: any = { level: 0 };
    const pageInfo = helper.checkPagination(query);

    if (!isAdmin) conditions.status = true;

    if (query.textSearch?.length) {
      conditions["$or"] = [
        { name: { $regex: helper.regxEscape(query.textSearch), $options: "i" } },
        { "subCategories.name": { $regex: helper.regxEscape(query.textSearch), $options: "i" } },
        { "subCategories.subCategories.name": { $regex: helper.regxEscape(query.textSearch), $options: "i" } },
      ];
    }

    if ("status" in query) conditions.status = query.status;
    if ("createdAt" in query) conditions.date = new Date(query.createdAt);
    let docs = pageInfo ? [{ $skip: pageInfo.skip }, { $limit: pageInfo.pageSize }] : [];

    let stages = [
      {
        $lookup: {
          from: "categories",
          let: { ids: "$subCategories" },
          pipeline: [
            { $match: { $expr: { $in: ["$_id", "$$ids"] } } },

            ...("status" in query
              ? [{ $match: { $expr: { $eq: ["$deleted", false] } } }, { $match: { $expr: { $eq: ["$status", true] } } }]
              : [{ $match: { $expr: { $eq: ["$deleted", false] } } }]),

            {
              $lookup: {
                from: "categories",
                let: { ids: "$subCategories" },
                pipeline: [
                  { $match: { $expr: { $in: ["$_id", "$$ids"] } } },
                  { $match: { $expr: { $eq: ["$deleted", false] } } },
                  { $project: { name: 1, status: 1, image: 1, collections: 1, date: 1, createdAt: 1 } },
                  {
                    $lookup: {
                      from: "collections",
                      let: { cIds: "$collections" },
                      pipeline: [
                        { $match: { $expr: { $in: ["$_id", "$$cIds"] } } },
                        { $match: { $expr: { $eq: ["$deleted", false] } } },
                        { $project: { title: 1, status: 1, date: 1, createdAt: 1 } },
                      ],
                      as: "collections",
                    },
                  },
                ],
                // localField: "subCategories",
                // foreignField: "_id",
                as: "subCategories",
              },
            },
            // { $project: { name: 1, status: 1, image: 1, collections: 1, date: 1, createdAt: 1 } },
            {
              $lookup: {
                from: "collections",
                let: { cIds: "$collections" },
                pipeline: [
                  { $match: { $expr: { $in: ["$_id", "$$cIds"] } } },
                  { $match: { $expr: { $eq: ["$deleted", false] } } },
                  { $project: { title: 1, status: 1, date: 1, createdAt: 1 } },
                ],
                as: "collections",
              },
            },
          ],
          // localField: "subCategories",
          // foreignField: "_id",
          as: "subCategories",
        },
      },
      {
        $lookup: {
          from: "collections",
          localField: "subCategories.collections",
          foreignField: "_id",
          as: "collections",
        },
      },
      { $match: conditions },
      { $sort: { date: -1 } },
      { $facet: { meta: [{ $count: "count" }], docs: docs } },
      { $unwind: { path: "$meta" } },
      { $project: { count: "$meta.count", docs: "$docs" } },
    ];

    return (await categoryModel.aggregate(stages))[0] ?? null;
  } catch (error) {
    throw error;
  }
};

/**
 * populate category data
 */
const populateCategory = (query: any, isAdmin: boolean = false) => {
  let match: any = {};
  if (!isAdmin) match.status = true;

  return query
    .populate({
      path: "subCategories",
      match,
      options: { sort: { name: 1 } },
      populate: { path: "subCategories", match, options: { sort: { name: 1 } } },
    })
    .sort({ name: 1 })
    .lean();
};

/**
 * create main category handler
 */
const createMainCategory = async (name: string, status: boolean, image: string, createdBy: string) => {
  try {
    return await categoryModel.create({ name, status, level: 0, image, createdBy });
  } catch (error) {
    throw error;
  }
};

/**
 * update main category handler
 */
const updateMainCategory = async (
  categoryId: string,
  name: string,
  status: boolean,
  image: string,
  collectionIds: string[]
) => {
  try {
    let data: any = { name, status, collections: collectionIds };
    if (image) data.image = image;
    const category = await categoryModel.findById(categoryId);
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
    const category = await populateCategory(categoryModel.findOne({ _id: categoryId, level: 0 }));
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
    let result = await categoryStages(queryParams, true);
    return helper.makePaginatedData(result?.docs || [], result?.count || 0);
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
    let condition: any = { level: 0, status: true };
    const pageInfo = helper.checkPagination(queryParams);

    if (textSearch && textSearch?.length) condition.name = { $regex: helper.regxEscape(textSearch), $options: "i" };
    if (status) condition.status = status;
    if (createdAt) condition.date = createdAt;

    let mongoQuery = populateCategory(categoryModel.find(condition), false);
    let count: number = await categoryModel.countDocuments(condition);

    let docs: any[] = [];
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
    let category = await categoryModel
      .findOne({ _id: categoryId })
      .populate({ path: "subCategories", match: { status: true } });
    if (!category) throw helper.buildError("No category found with this id", 404);
    const catToJSON: any = category.toJSON();

    // if (catToJSON.status) {
    //   throw helper.buildError("You are not allowed to delete this category as status is active", 400);
    // }
    if (catToJSON.subCategories?.length) throw helper.buildError("Please delete all the sub categories first", 400);
    return await category.delete();
  } catch (error) {
    throw error;
  }
};

/**
 * create sub category handler
 */
const createSubCategory = async (
  mainCategoryId: string,
  name: string,
  status: boolean,
  image: string,
  collectionIds: string[],
  createdBy: string
) => {
  try {
    let mainCat = await categoryModel.findById(mainCategoryId);
    if (!mainCat) throw helper.buildError("No main category found with this id", 404);
    const mainCatToJson: any = mainCat.toJSON();
    let level = mainCatToJson.level + 1;
    const data = { name, status, image, level, collections: collectionIds || [], createdBy };
    const subCategory = await categoryModel.create(data);
    await mainCat.updateOne({ $push: { subCategories: subCategory._id } });
  } catch (error) {
    throw error;
  }
};

/**
 * update sub category handler
 */
const updateSubCategory = async (subCategoryId: string, data: any) => {
  try {
    const subCategory = await categoryModel.findOne({ _id: subCategoryId });
    if (!subCategory) throw helper.buildError("No sub category found with this id", 404);
    return await subCategory.set(data).save();
  } catch (error) {
    throw error;
  }
};

/**
 * get single sub category handler
 */
const getSubCategory = async (categoryId: string) => {
  try {
    const category = await populateCategory(categoryModel.findOne({ _id: categoryId }));
    if (!category) throw helper.buildError("No category found with this id", 404);
    return category;
  } catch (error) {
    throw error;
  }
};

/**
 * get sub category list  by admin handler
 */
const getSubCategoriesByAdmin = async (mainCategoryId: string, queryParams: any) => {
  try {
    const pageInfo = helper.checkPagination(queryParams);
    const category: any = await populateCategory(categoryModel.findOne({ _id: mainCategoryId }));

    if (!category) throw helper.buildError("No category found with this id", 404);
    let conditions: any = { _id: { $in: category.subCategories } };

    if (queryParams.textSearch?.length)
      conditions.name = { $regex: helper.regxEscape(queryParams.textSearch), $options: "i" };
    let count = await categoryModel.countDocuments(conditions);
    let docs: any[] = [];
    const mongoQuery = categoryModel.find(conditions).sort({ slug: 1 });

    if (pageInfo) docs = await populateCategory(mongoQuery.skip(pageInfo.skip).limit(pageInfo.pageSize), true);
    else docs = await populateCategory(mongoQuery, true);

    return helper.makePaginatedData(docs, count, pageInfo);
  } catch (error) {
    throw error;
  }
};

/**
 * get sub category list handler
 */
const getSubCategories = async (mainCategoryId: string, queryParams: any) => {
  try {
    const pageInfo = helper.checkPagination(queryParams);
    const category: any = await populateCategory(categoryModel.findOne({ _id: mainCategoryId, status: true }));

    if (!category) throw helper.buildError("No category found with this id", 404);
    let conditions: any = { status: true, _id: { $in: category.subCategories } };

    if (queryParams.textSearch?.length)
      conditions.name = { $regex: helper.regxEscape(queryParams.textSearch), $options: "i" };
    let count = await categoryModel.countDocuments(conditions);
    let docs: any[] = [];
    const mongoQuery = categoryModel.find(conditions).sort({ slug: 1 });

    if (pageInfo) docs = await populateCategory(mongoQuery.skip(pageInfo.skip).limit(pageInfo.pageSize), false);
    else docs = await populateCategory(mongoQuery, false);

    return helper.makePaginatedData(docs, count, pageInfo);
  } catch (error) {
    throw error;
  }
};

/**
 * delete sub category handler
 */
const deleteSubCategory = async (categoryId: string) => {
  try {
    let category = await categoryModel
      .findOne({ _id: categoryId })
      .populate({ path: "subCategories", match: { status: true } });
    if (!category) throw helper.buildError("No category found with this id", 404);
    const catToJSON: any = category.toJSON();

    if (catToJSON.status)
      throw helper.buildError("You are not allowed to delete this category as stautus is active", 400);
    if (catToJSON.subCategories?.length) throw helper.buildError("Please delete all the sub categories first", 400);

    return await category.delete();
  } catch (error) {
    throw error;
  }
};

/**
 * update sub/main category status handler
 */
const updateCategoryStatus = async (categoryId: string, status: boolean) => {
  try {
    let category = await categoryModel.findOne({ _id: categoryId });
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
  updateSubCategory,
  getSubCategory,
  getSubCategories,
  deleteSubCategory,
  updateCategoryStatus,
  getMainCategoriesByAdmin,
  getSubCategoriesByAdmin,
};
