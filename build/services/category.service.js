"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../models");
const utils_1 = require("../utils");
utils_1.helper.loadEnvFile();
// fetch category stages
const categoryStages = (query, isAdmin = false) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        let conditions = { level: 0 };
        const pageInfo = utils_1.helper.checkPagination(query);
        if (!isAdmin)
            conditions.status = true;
        if ((_a = query.textSearch) === null || _a === void 0 ? void 0 : _a.length) {
            conditions["$or"] = [
                { name: { $regex: utils_1.helper.regxEscape(query.textSearch), $options: "i" } },
                { "subCategories.name": { $regex: utils_1.helper.regxEscape(query.textSearch), $options: "i" } },
                { "subCategories.subCategories.name": { $regex: utils_1.helper.regxEscape(query.textSearch), $options: "i" } },
            ];
        }
        if ("status" in query)
            conditions.status = query.status;
        if ("createdAt" in query)
            conditions.date = new Date(query.createdAt);
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
        return (_b = (yield models_1.categoryModel.aggregate(stages))[0]) !== null && _b !== void 0 ? _b : null;
    }
    catch (error) {
        throw error;
    }
});
/**
 * populate category data
 */
const populateCategory = (query, isAdmin = false) => {
    let match = {};
    if (!isAdmin)
        match.status = true;
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
const createMainCategory = (name, status, image, createdBy) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield models_1.categoryModel.create({ name, status, level: 0, image, createdBy });
    }
    catch (error) {
        throw error;
    }
});
/**
 * update main category handler
 */
const updateMainCategory = (categoryId, name, status, image, collectionIds) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let data = { name, status, collections: collectionIds };
        if (image)
            data.image = image;
        const category = yield models_1.categoryModel.findById(categoryId);
        if (!category)
            throw utils_1.helper.buildError("No category found with this id", 404);
        return yield category.set(data).save();
    }
    catch (error) {
        throw error;
    }
});
/**
 * get single main category handler
 */
const getMainCategory = (categoryId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const category = yield populateCategory(models_1.categoryModel.findOne({ _id: categoryId, level: 0 }));
        if (!category)
            throw utils_1.helper.buildError("No category found with this id", 404);
        return category;
    }
    catch (error) {
        throw error;
    }
});
/**
 * get main categories by admin handler
 */
const getMainCategoriesByAdmin = (queryParams) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let result = yield categoryStages(queryParams, true);
        return utils_1.helper.makePaginatedData((result === null || result === void 0 ? void 0 : result.docs) || [], (result === null || result === void 0 ? void 0 : result.count) || 0);
    }
    catch (error) {
        throw error;
    }
});
/**
 * get main categories handler
 */
const getMainCategories = (queryParams) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { textSearch, status, createdAt } = queryParams;
        let condition = { level: 0, status: true };
        const pageInfo = utils_1.helper.checkPagination(queryParams);
        if (textSearch && (textSearch === null || textSearch === void 0 ? void 0 : textSearch.length))
            condition.name = { $regex: utils_1.helper.regxEscape(textSearch), $options: "i" };
        if (status)
            condition.status = status;
        if (createdAt)
            condition.date = createdAt;
        let mongoQuery = populateCategory(models_1.categoryModel.find(condition), false);
        let count = yield models_1.categoryModel.countDocuments(condition);
        let docs = [];
        if (pageInfo)
            docs = yield mongoQuery.skip(pageInfo.skip).limit(pageInfo.pageSize);
        else
            docs = yield mongoQuery;
        return utils_1.helper.makePaginatedData(docs, count, pageInfo);
    }
    catch (error) {
        throw error;
    }
});
/**
 * delete main category handler
 */
const deleteMainCategory = (categoryId) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    try {
        let category = yield models_1.categoryModel
            .findOne({ _id: categoryId })
            .populate({ path: "subCategories", match: { status: true } });
        if (!category)
            throw utils_1.helper.buildError("No category found with this id", 404);
        const catToJSON = category.toJSON();
        // if (catToJSON.status) {
        //   throw helper.buildError("You are not allowed to delete this category as status is active", 400);
        // }
        if ((_c = catToJSON.subCategories) === null || _c === void 0 ? void 0 : _c.length)
            throw utils_1.helper.buildError("Please delete all the sub categories first", 400);
        return yield category.delete();
    }
    catch (error) {
        throw error;
    }
});
/**
 * create sub category handler
 */
const createSubCategory = (mainCategoryId, name, status, image, collectionIds, createdBy) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let mainCat = yield models_1.categoryModel.findById(mainCategoryId);
        if (!mainCat)
            throw utils_1.helper.buildError("No main category found with this id", 404);
        const mainCatToJson = mainCat.toJSON();
        let level = mainCatToJson.level + 1;
        const data = { name, status, image, level, collections: collectionIds || [], createdBy };
        const subCategory = yield models_1.categoryModel.create(data);
        yield mainCat.updateOne({ $push: { subCategories: subCategory._id } });
    }
    catch (error) {
        throw error;
    }
});
/**
 * update sub category handler
 */
const updateSubCategory = (subCategoryId, data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const subCategory = yield models_1.categoryModel.findOne({ _id: subCategoryId });
        if (!subCategory)
            throw utils_1.helper.buildError("No sub category found with this id", 404);
        return yield subCategory.set(data).save();
    }
    catch (error) {
        throw error;
    }
});
/**
 * get single sub category handler
 */
const getSubCategory = (categoryId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const category = yield populateCategory(models_1.categoryModel.findOne({ _id: categoryId }));
        if (!category)
            throw utils_1.helper.buildError("No category found with this id", 404);
        return category;
    }
    catch (error) {
        throw error;
    }
});
/**
 * get sub category list  by admin handler
 */
const getSubCategoriesByAdmin = (mainCategoryId, queryParams) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    try {
        const pageInfo = utils_1.helper.checkPagination(queryParams);
        const category = yield populateCategory(models_1.categoryModel.findOne({ _id: mainCategoryId }));
        if (!category)
            throw utils_1.helper.buildError("No category found with this id", 404);
        let conditions = { _id: { $in: category.subCategories } };
        if ((_d = queryParams.textSearch) === null || _d === void 0 ? void 0 : _d.length)
            conditions.name = { $regex: utils_1.helper.regxEscape(queryParams.textSearch), $options: "i" };
        let count = yield models_1.categoryModel.countDocuments(conditions);
        let docs = [];
        const mongoQuery = models_1.categoryModel.find(conditions).sort({ slug: 1 });
        if (pageInfo)
            docs = yield populateCategory(mongoQuery.skip(pageInfo.skip).limit(pageInfo.pageSize), true);
        else
            docs = yield populateCategory(mongoQuery, true);
        return utils_1.helper.makePaginatedData(docs, count, pageInfo);
    }
    catch (error) {
        throw error;
    }
});
/**
 * get sub category list handler
 */
const getSubCategories = (mainCategoryId, queryParams) => __awaiter(void 0, void 0, void 0, function* () {
    var _e;
    try {
        const pageInfo = utils_1.helper.checkPagination(queryParams);
        const category = yield populateCategory(models_1.categoryModel.findOne({ _id: mainCategoryId, status: true }));
        if (!category)
            throw utils_1.helper.buildError("No category found with this id", 404);
        let conditions = { status: true, _id: { $in: category.subCategories } };
        if ((_e = queryParams.textSearch) === null || _e === void 0 ? void 0 : _e.length)
            conditions.name = { $regex: utils_1.helper.regxEscape(queryParams.textSearch), $options: "i" };
        let count = yield models_1.categoryModel.countDocuments(conditions);
        let docs = [];
        const mongoQuery = models_1.categoryModel.find(conditions).sort({ slug: 1 });
        if (pageInfo)
            docs = yield populateCategory(mongoQuery.skip(pageInfo.skip).limit(pageInfo.pageSize), false);
        else
            docs = yield populateCategory(mongoQuery, false);
        return utils_1.helper.makePaginatedData(docs, count, pageInfo);
    }
    catch (error) {
        throw error;
    }
});
/**
 * delete sub category handler
 */
const deleteSubCategory = (categoryId) => __awaiter(void 0, void 0, void 0, function* () {
    var _f;
    try {
        let category = yield models_1.categoryModel
            .findOne({ _id: categoryId })
            .populate({ path: "subCategories", match: { status: true } });
        if (!category)
            throw utils_1.helper.buildError("No category found with this id", 404);
        const catToJSON = category.toJSON();
        if (catToJSON.status)
            throw utils_1.helper.buildError("You are not allowed to delete this category as stautus is active", 400);
        if ((_f = catToJSON.subCategories) === null || _f === void 0 ? void 0 : _f.length)
            throw utils_1.helper.buildError("Please delete all the sub categories first", 400);
        return yield category.delete();
    }
    catch (error) {
        throw error;
    }
});
/**
 * update sub/main category status handler
 */
const updateCategoryStatus = (categoryId, status) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let category = yield models_1.categoryModel.findOne({ _id: categoryId });
        if (!category)
            throw utils_1.helper.buildError("No category found with this id", 404);
        return yield category.set({ status }).save();
    }
    catch (error) {
        throw error;
    }
});
exports.default = {
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
