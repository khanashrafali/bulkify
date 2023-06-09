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
const checkItem = (val, { req }) => __awaiter(void 0, void 0, void 0, function* () {
    let item = yield models_1.bdProductModel.findById(val);
    if (!item)
        throw utils_1.helper.buildError("No item found with this id", 404);
});
const addBDProduct = [
    (0, express_validator_1.body)("product", "Please enter valid productId").exists().isMongoId(),
    (0, express_validator_1.body)("variant", "Please enter valid variant").exists().isMongoId(),
];
const deleteDBProduct = [
    (0, express_validator_1.param)("productId", "Please enter valid productId").exists().isMongoId(),
    (0, express_validator_1.param)("variantId", "Please enter valid variantId").exists().isMongoId(),
];
exports.default = {
    addBDProduct,
    deleteDBProduct,
};
