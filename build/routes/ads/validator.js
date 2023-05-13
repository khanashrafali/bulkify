"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const addAds = [
    (0, express_validator_1.body)("location", "Please enter valid location like HOME, FILTER").exists().isIn(["HOME", "FILTER"]),
    (0, express_validator_1.body)("redirectURL", "Please enter valid redirectURL").exists().isURL(),
    (0, express_validator_1.body)("product", "Please enter valid product").optional().isMongoId(),
    (0, express_validator_1.body)("category", "Please enter valid category").optional().isMongoId(),
    (0, express_validator_1.body)("brand", "Please enter valid brand").optional().isMongoId(),
];
const getAds = [(0, express_validator_1.param)("adsId", "Please enter valid adsId").exists().isMongoId()];
const updateAds = [...getAds, ...addAds];
const deleteAds = [...getAds];
exports.default = {
    addAds,
    updateAds,
    deleteAds,
    getAds,
};
