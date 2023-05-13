"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const postAddReview = [
    (0, express_validator_1.body)("order", "Please enter valid orderId").exists().isMongoId(),
    (0, express_validator_1.body)("product", "Please enter valid productId").exists().isMongoId(),
    (0, express_validator_1.body)("commentText", "Please enter valid commentText").trim(),
    (0, express_validator_1.body)("rating", "Please enter valid rating")
        .exists()
        .toFloat()
        .isFloat({ gt: 0.9, lt: 5.1 })
        .withMessage("Rating must be greator then 0 and equal to 5"),
];
const getProductReviews = [(0, express_validator_1.param)("productId", "Please enter valid productId").exists().isMongoId()];
const deleteReview = [(0, express_validator_1.param)("reviewId", "Please enter valid reviewId").exists().isMongoId()];
const getProductReview = [
    (0, express_validator_1.query)("productId", "Please enter valid productId").exists().trim().notEmpty().isMongoId(),
    (0, express_validator_1.query)("orderId", "Please enter valid orderId").exists().trim().notEmpty().isMongoId(),
];
const setAdminRating = [
    (0, express_validator_1.body)("adminRating", "Please enter valid adminRating").exists().isFloat({ gt: -1, lt: 5.1 }),
    (0, express_validator_1.param)("productId", "Please enter valid productId").exists().trim().notEmpty().isMongoId(),
];
exports.default = {
    postAddReview,
    getProductReviews,
    deleteReview,
    getProductReview,
    setAdminRating,
};
