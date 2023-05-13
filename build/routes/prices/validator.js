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
const getPrices = [(0, express_validator_1.query)("to", "Please enter valid to").optional().isMongoId()];
const addPrice = [
    (0, express_validator_1.body)("heading", "Please enter valid heading").exists().trim().notEmpty(),
    (0, express_validator_1.body)("key").exists().trim().notEmpty(),
    (0, express_validator_1.body)("diffrence").exists().isInt({ gt: -1 }),
    (0, express_validator_1.body)("from", "Please enter valid from").exists().isInt({ gt: -1 }),
    (0, express_validator_1.body)("to", "Please enter valid to").exists().isInt({ gt: -1 }),
];
const deletePrice = [
    (0, express_validator_1.param)("priceId", "Please enter valid price id")
        .exists()
        .isMongoId()
        .custom((v, { req }) => __awaiter(void 0, void 0, void 0, function* () {
        let price = yield models_1.pricesModel.findOne({ _id: v });
        if (!price)
            throw utils_1.helper.buildError("no price found with this id", 404);
    })),
];
const updatePrice = [...deletePrice, ...addPrice];
exports.default = {
    addPrice,
    updatePrice,
    getPrices,
    deletePrice,
};
