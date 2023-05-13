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
const express_validator_1 = require("express-validator");
const models_1 = require("../../models");
const utils_1 = require("../../utils");
const checkDuplicateCollection = (val, { req }) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    let conditions = {
        title: { $regex: new RegExp(`^${utils_1.helper.regxEscape(val)}$`), $options: "i" },
    };
    if ((_a = req.params) === null || _a === void 0 ? void 0 : _a.collectionId)
        conditions._id = { $ne: (_b = req.params) === null || _b === void 0 ? void 0 : _b.collectionId };
    const collection = yield models_1.collectionModel.findOne(conditions);
    if (collection)
        throw utils_1.helper.buildError("same collection already exists", 400);
});
const postAddCollection = [
    (0, express_validator_1.body)("chartImage", "Please enter valid chartImage").optional({ nullable: true }).isURL(),
    (0, express_validator_1.body)("image", "Please enter valid image").exists().isURL(),
    (0, express_validator_1.body)("title", "Please enter valid title").exists({ checkFalsy: false }).trim().notEmpty().custom(checkDuplicateCollection),
    (0, express_validator_1.body)("description", "Please enter valid description").exists({ checkFalsy: false }).trim(),
    (0, express_validator_1.body)("mustMatchAll", "Please enter valid mustMatchAll").exists({ checkFalsy: false }).isBoolean(),
    (0, express_validator_1.body)("conditions", "Please enter valid conditions").exists({ checkFalsy: false }).isArray({ min: 1 }),
    (0, express_validator_1.body)("conditions.*.field", `Please enter valid field of conditions like ${utils_1.CONSTANT.PRODUCT_FIELDS.map((e) => e.key).join(", ")}`)
        .exists()
        .trim()
        .notEmpty()
        .isIn(utils_1.CONSTANT.PRODUCT_FIELDS.map((e) => e.key)),
    (0, express_validator_1.body)("conditions.*.condition", `Please enter valid condition of conditions like ${utils_1.CONSTANT.PRODUCT_CONDITION()
        .map((e) => e.key)
        .join(", ")}`)
        .exists()
        .trim()
        .notEmpty()
        .isIn(utils_1.CONSTANT.PRODUCT_CONDITION().map((e) => e.key)),
    (0, express_validator_1.body)("conditions.*.value", "Please enter valid value of conditions").exists().trim().notEmpty(),
];
const putUpdateCollection = [
    (0, express_validator_1.param)("collectionId", "Please enter valid collectionId").exists().isMongoId(),
    (0, express_validator_1.body)("chartImage", "Please enter valid chartImage").optional({ nullable: true }).isURL(),
    (0, express_validator_1.body)("image", "Please enter valid image").exists().isURL(),
    (0, express_validator_1.body)("title", "Please enter valid title").exists({ checkFalsy: false }).trim().notEmpty().custom(checkDuplicateCollection),
    (0, express_validator_1.body)("description", "Please enter valid description").exists({ checkFalsy: false }).trim(),
    (0, express_validator_1.body)("mustMatchAll", "Please enter valid mustMatchAll").exists({ checkFalsy: false }).isBoolean(),
    (0, express_validator_1.body)("conditions", "Please enter valid conditions").exists({ checkFalsy: false }).isArray({ min: 1 }),
    (0, express_validator_1.body)("conditions.*.field", `Please enter valid field of conditions like ${utils_1.CONSTANT.PRODUCT_FIELDS.map((e) => e.key).join(", ")}`)
        .exists()
        .trim()
        .notEmpty()
        .isIn(utils_1.CONSTANT.PRODUCT_FIELDS.map((e) => e.key)),
    (0, express_validator_1.body)("conditions.*.condition", `Please enter valid condition of conditions like ${utils_1.CONSTANT.PRODUCT_CONDITION()
        .map((e) => e.key)
        .join(", ")}`)
        .exists()
        .trim()
        .notEmpty()
        .isIn(utils_1.CONSTANT.PRODUCT_CONDITION().map((e) => e.key)),
    (0, express_validator_1.body)("conditions.*.value", "Please enter valid value of conditions").exists().trim().notEmpty(),
];
const getCollection = [(0, express_validator_1.param)("collectionId", "Please enter valid collectionId").exists().isMongoId()];
const deleteCollection = [(0, express_validator_1.param)("collectionId", "Please enter valid collectionId").exists().isMongoId()];
const getCollections = [
    (0, express_validator_1.query)("createdAt", "Please enter valid createdAt").optional().isDate({
        format: utils_1.CONSTANT.DATE,
    }),
    (0, express_validator_1.query)("status", "Please enter valid status").optional().isIn(["true", "false"]).toBoolean(),
    (0, express_validator_1.query)("isFeatured", "Please enter valid isFeatured").optional().isIn(["true", "false"]).toBoolean(),
    (0, express_validator_1.query)("page", "Please enter valid page").optional().toInt().isInt({ gt: 0 }),
    (0, express_validator_1.query)("pageSize", "Please enter valid pageSize").optional().toInt().isInt({ gt: 0 }),
];
const putAttachCollections = [
    (0, express_validator_1.param)("categoryId", "Please enter valid categoryId").exists().isMongoId(),
    (0, express_validator_1.body)("collectionIds", "Please enter valid collectionIds").optional({ checkFalsy: true }).isArray(),
    (0, express_validator_1.body)("collectionIds.*", "Please enter valid collection Id").optional({ checkFalsy: true }).isMongoId(),
];
const putDeattachCollection = [
    (0, express_validator_1.param)("categoryId", "Please enter valid categoryId").exists().isMongoId(),
    (0, express_validator_1.body)("collectionId", "Please enter valid collection Id").exists().isMongoId(),
];
const patchUpdateCollectionStatus = [
    (0, express_validator_1.param)("collectionId", "Please enter valid collectionId").exists().isMongoId(),
    (0, express_validator_1.body)("status", "Please enter valid status like true, false").exists().isBoolean(),
];
const patchUpdateCollectionFeaturedStatus = [
    (0, express_validator_1.param)("collectionId", "Please enter valid collectionId").exists().isMongoId(),
    (0, express_validator_1.body)("isFeatured", "Please enter valid isFeatured like true, false").exists().isBoolean(),
];
exports.default = {
    postAddCollection,
    putUpdateCollection,
    getCollection,
    deleteCollection,
    getCollections,
    putAttachCollections,
    putDeattachCollection,
    patchUpdateCollectionStatus,
    patchUpdateCollectionFeaturedStatus,
};
