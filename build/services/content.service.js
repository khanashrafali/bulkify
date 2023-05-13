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
 * create content handler
 */
const addContent = (body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, subTitle, sortDescription, description } = body;
        let content = yield models_1.contentModel.findOne({
            title: { $regex: new RegExp(`^${utils_1.helper.regxEscape(title)}$`), $options: "i" },
        });
        let obj = { title, subTitle, sortDescription, description };
        if (content)
            throw utils_1.helper.buildError("Same content title already exists.");
        yield models_1.contentModel.create(obj);
    }
    catch (error) {
        throw error;
    }
});
/**
 * update content handler
 */
const updateContent = (contentIdOrSlug, body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let id = validator_1.default.isMongoId(contentIdOrSlug) ? { _id: contentIdOrSlug } : { slug: contentIdOrSlug };
        const { title, subTitle, sortDescription, description, appDescription } = body;
        let obj = { title, subTitle, sortDescription, description, appDescription };
        let existing = yield models_1.contentModel.findOne(id);
        if (!existing)
            throw utils_1.helper.buildError("no content found with this id/slug", 404);
        let content = yield models_1.contentModel.findOne({
            title: { $regex: new RegExp(`^${utils_1.helper.regxEscape(title)}$`), $options: "i" },
            _id: { $ne: existing._id },
        });
        if (content)
            throw utils_1.helper.buildError("Same content title already exists.");
        yield existing.set(obj).save();
    }
    catch (error) {
        throw error;
    }
});
/**
 * get content handler
 */
const getContent = (contentIdOrSlug) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let id = validator_1.default.isMongoId(contentIdOrSlug) ? { _id: contentIdOrSlug } : { slug: contentIdOrSlug };
        let content = yield models_1.contentModel.findOne(id).lean();
        if (!content)
            throw utils_1.helper.buildError("No content found with this id", 404);
        return content;
    }
    catch (error) {
        throw error;
    }
});
/**
 * delete content handler
 */
const deleteContent = (contentIdOrSlug) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let id = validator_1.default.isMongoId(contentIdOrSlug) ? { _id: contentIdOrSlug } : { slug: contentIdOrSlug };
        let content = yield models_1.contentModel.findOne(id);
        if (!content)
            throw utils_1.helper.buildError("No content found with this id", 404);
        yield content.delete();
    }
    catch (error) {
        throw error;
    }
});
/**
 * get content list handler
 */
const getContents = (queryParams) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        let docs = [];
        let conditions = {};
        const pageInfo = utils_1.helper.checkPagination(queryParams);
        if ("createdAt" in queryParams)
            conditions.date = queryParams.createdAt;
        if ((_a = queryParams.textSearch) === null || _a === void 0 ? void 0 : _a.length) {
            conditions["$or"] = [
                { title: { $regex: utils_1.helper.regxEscape(queryParams.textSearch), $options: "i" } },
                { subTitle: { $regex: utils_1.helper.regxEscape(queryParams.textSearch), $options: "i" } },
                { sortDescription: { $regex: utils_1.helper.regxEscape(queryParams.textSearch), $options: "i" } },
            ];
        }
        const count = yield models_1.contentModel.countDocuments(conditions);
        let mongoQuery = models_1.contentModel.find(conditions);
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
exports.default = {
    addContent,
    updateContent,
    getContent,
    deleteContent,
    getContents,
};
