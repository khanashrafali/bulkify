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
const express_validator_1 = require("express-validator");
const validator_1 = __importDefault(require("validator"));
const models_1 = require("../../models");
const utils_1 = require("../../utils");
const checkDuplicateTitle = (val, { req }) => __awaiter(void 0, void 0, void 0, function* () {
    let conditions = {
        title: { $regex: new RegExp(`^${utils_1.helper.regxEscape(val)}$`), $options: "i" },
    };
    let { contentIdOrSlug } = req.params;
    if (contentIdOrSlug) {
        let isId = validator_1.default.isMongoId(contentIdOrSlug);
        isId ? (conditions._id = { $ne: contentIdOrSlug }) : (conditions.slug = { $ne: contentIdOrSlug });
    }
    const content = yield models_1.contentModel.findOne(conditions);
    if (content)
        throw utils_1.helper.buildError("Same content title already exists", 400);
});
const isContentExists = (contentIdOrSlug, { req }) => __awaiter(void 0, void 0, void 0, function* () {
    let isId = validator_1.default.isMongoId(contentIdOrSlug);
    let conditions = isId ? { _id: contentIdOrSlug } : { slug: contentIdOrSlug };
    const content = yield models_1.contentModel.findOne(conditions);
    if (!content)
        throw utils_1.helper.buildError("no content found with this id", 404);
});
const addContent = [
    (0, express_validator_1.body)("title", "Please enter valid title").exists().trim().notEmpty().custom(checkDuplicateTitle),
    (0, express_validator_1.body)("subTitle", "Please enter valid subTitle").exists().trim().notEmpty(),
    (0, express_validator_1.body)("sortDescription", "Please enter valid sortDescription").exists().trim().notEmpty(),
    (0, express_validator_1.body)("description", "Please enter valid description").exists().trim().notEmpty(),
    (0, express_validator_1.body)("appDescription", "Please enter valid appDescription").exists().trim().notEmpty(),
];
const getContent = [(0, express_validator_1.param)("contentIdOrSlug", "Please enter valid contentIdOrSlug").exists().custom(isContentExists)];
const deleteContent = [...getContent];
const updateContent = [...getContent, ...addContent];
const getContents = [...utils_1.helper.getPaginationValidator];
exports.default = {
    addContent,
    updateContent,
    deleteContent,
    getContent,
    getContents,
};
