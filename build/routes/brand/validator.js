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
const checkDuplicateBrand = (val, { req }) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        let conditions = { brandName: { $regex: utils_1.helper.regxEscape(val), $options: "i" } };
        if ((_a = req.params) === null || _a === void 0 ? void 0 : _a.brandId)
            conditions._id = { $ne: (_b = req.params) === null || _b === void 0 ? void 0 : _b.brandId };
        const address = yield models_1.brandModel.findOne(conditions);
        console.log({ address });
        if (address)
            throw utils_1.helper.buildError("same brand already exists", 400);
    }
    catch (error) {
        throw error;
    }
});
const addBrand = [
    (0, express_validator_1.body)("image", "Please enter valid image url").optional().isObject(),
    (0, express_validator_1.body)("brandName", "Please enter valid brandName").exists().trim().notEmpty().custom(checkDuplicateBrand),
    (0, express_validator_1.body)("categories", "Please enter valid categories").exists().isArray(),
    (0, express_validator_1.body)("categories.*", "Please enter valid category").exists().isMongoId(),
    (0, express_validator_1.body)("isApproved", "Please enter valid isApproved").exists().trim().isBoolean(),
];
const getBrand = [(0, express_validator_1.param)("brandId", "Please enter valid brandId").exists().isMongoId()];
const updateBrand = [...getBrand, ...addBrand];
const deleteBrand = [...getBrand];
const updateStatus = [...getBrand, (0, express_validator_1.body)("isApproved", "Please enter valid isApproved").exists().trim().isBoolean()];
exports.default = {
    addBrand,
    updateBrand,
    updateStatus,
    getBrand,
    deleteBrand,
};
