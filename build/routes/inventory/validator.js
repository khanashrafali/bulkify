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
const models_1 = require("../../models");
const validator_1 = __importDefault(require("validator"));
const utils_1 = require("../../utils");
const checkDuplicateProduct = (val, { req }) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let conditions = { name: { $regex: utils_1.helper.regxEscape(val), $options: "i" } };
    let pId = (_a = req.params) === null || _a === void 0 ? void 0 : _a.productIdOrSlug;
    if (pId)
        validator_1.default.isMongoId(pId) ? (conditions._id = { $ne: pId }) : (conditions.slug = { $ne: pId });
    const product = yield models_1.productModel.findOne(conditions);
    if (product)
        throw utils_1.helper.buildError("Same product already exists", 400);
});
const updateProductStockData = [
    (0, express_validator_1.param)("productId", "Please enter valid product id")
        .exists()
        .isMongoId()
        .custom((v, { req }) => __awaiter(void 0, void 0, void 0, function* () {
        const product = yield models_1.productModel.findOne({ _id: v });
        if (!product)
            throw utils_1.helper.buildError("no product found with this id", 404);
    })),
    (0, express_validator_1.body)("images", "Images should not be empty").isArray({ min: 1 }),
    (0, express_validator_1.body)("images.*", "Images should not be empty").trim().notEmpty().isURL(),
    (0, express_validator_1.body)("name", "Please enter valid name").exists().trim().notEmpty().custom(checkDuplicateProduct),
    (0, express_validator_1.body)("description", "Please enter valid description").exists().trim().notEmpty(),
    (0, express_validator_1.body)("status", "Please enter valid status like true, false").exists().trim().isIn(["true", "false"]).toBoolean(),
    (0, express_validator_1.body)("variants", "Please enter valid variants").exists().isArray({ min: 1 }),
    (0, express_validator_1.body)("metaDescription", "Please enter valid meta description").exists().trim().notEmpty(),
    (0, express_validator_1.body)("variants.*.variant.SKU", "Please enter valid variant's SKU")
        .exists()
        .trim()
        .isAlphanumeric("en-IN")
        .withMessage("SKU must be alphanumeric"),
    (0, express_validator_1.body)("variants.*.variant.mrp", "Please enter valid variant's mrp").exists().isFloat({ gt: 0 }),
    (0, express_validator_1.body)("variants.*.variant.sellingPrice", "Please enter valid variant's sellingPrice").exists().isFloat({ gt: 0 }),
    (0, express_validator_1.body)("variants.*.variant.quantity", "Please enter valid variant's quantity").exists().isInt({ gt: 0 }),
    (0, express_validator_1.body)("variants.*.variant.deleted", "Please enter valid variant's deleted").exists().isBoolean(),
    (0, express_validator_1.body)("category", "Please enter valid category").exists().isMongoId(),
    // body("subCategories", "Please enter valid sub Categories").exists().isArray(),
    // body("subCategories.*", "Please enter valid sub Category id").optional().isMongoId(),
    (0, express_validator_1.body)("tags", "Please enter valid tags").exists().isArray(),
];
exports.default = {
    updateProductStockData,
};
