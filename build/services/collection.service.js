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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const validator_1 = __importDefault(require("validator"));
const models_1 = require("../models");
const utils_1 = require("../utils");
utils_1.helper.loadEnvFile();
/**
 * get collection by id/slug handler
 */
const fetchCollection = (collectionIdOrSlug) => __awaiter(void 0, void 0, void 0, function* () {
    let condition = {};
    let isId = false;
    if (validator_1.default.isMongoId(collectionIdOrSlug.toString()))
        (isId = true), (condition._id = collectionIdOrSlug);
    else
        condition.slug = collectionIdOrSlug;
    const fetchedCol = yield models_1.collectionModel.findOne(condition);
    if (!fetchedCol)
        throw utils_1.helper.buildError(`No collection found with this ${isId ? "id" : "slug"}`, 404);
    return fetchedCol;
});
/**
 * create collection handler
 */
const addCollection = (req, body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, description, type, chartImage, image, mustMatchAll, conditions } = body;
        yield models_1.collectionModel.create({ title, description, type, chartImage, image, mustMatchAll, conditions, createdBy: req.user._id });
    }
    catch (error) {
        throw error;
    }
});
/**
 * update collection handler
 */
const updateCollection = (req, colId, body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, description, type, chartImage, image, mustMatchAll, conditions } = body;
        const col = yield fetchCollection(colId);
        yield col.set({ title, description, type, chartImage, image, mustMatchAll, conditions }).save();
    }
    catch (error) {
        throw error;
    }
});
/**
 * delete collection handler
 */
const deleteCollection = (req, colId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        yield ((_a = (yield fetchCollection(colId))) === null || _a === void 0 ? void 0 : _a.delete());
    }
    catch (error) {
        throw error;
    }
});
/**
 * get collection by id handler
 */
const getCollection = (colId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield fetchCollection(colId);
    }
    catch (error) {
        throw error;
    }
});
/**
 * get collection list handler
 */
const getCollections = (queryParams) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        let conditions = {};
        const pageInfo = utils_1.helper.checkPagination(queryParams);
        if ((_b = queryParams.textSearch) === null || _b === void 0 ? void 0 : _b.length)
            conditions.title = { $regex: utils_1.helper.regxEscape(queryParams.textSearch), $options: "i" };
        if ("status" in queryParams)
            conditions.status = queryParams.status;
        if ("createdAt" in queryParams)
            conditions.date = queryParams.createdAt;
        if ("isFeatured" in queryParams)
            conditions.isFeatured = queryParams.isFeatured;
        const count = yield models_1.collectionModel.countDocuments(conditions);
        const mongoQuery = models_1.collectionModel.find(conditions).sort({ createdAt: -1 });
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
 * get collection list by admin handler
 */
const getCollectionsByAdmin = (queryParams) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    try {
        let conditions = {};
        const pageInfo = utils_1.helper.checkPagination(queryParams);
        if ((_c = queryParams.textSearch) === null || _c === void 0 ? void 0 : _c.length)
            conditions.title = { $regex: utils_1.helper.regxEscape(queryParams.textSearch), $options: "i" };
        if ("status" in queryParams)
            conditions.status = queryParams.status;
        if ("createdAt" in queryParams)
            conditions.date = queryParams.createdAt;
        if ("isFeatured" in queryParams)
            conditions.isFeatured = queryParams.isFeatured;
        const count = yield models_1.collectionModel.countDocuments(conditions);
        const mongoQuery = models_1.collectionModel.find(conditions).sort({ createdAt: -1 });
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
 * update collection status handler
 */
const updateCollectionStatus = (colId, status) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (yield fetchCollection(colId)).set({ status }).save();
    }
    catch (error) {
        throw error;
    }
});
/**
 * update collection featured status handler
 */
const updateCollectionFeaturedStatus = (colId, isFeatured) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (yield fetchCollection(colId)).set({ isFeatured }).save();
    }
    catch (error) {
        throw error;
    }
});
exports.default = {
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
