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
const models_1 = require("../models");
const utils_1 = require("../utils");
const interfaces_1 = require("../utils/interfaces");
utils_1.helper.loadEnvFile();
// add review
const addReview = (ireq, reviewFiles, body) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        let fetchedReview = yield models_1.reviewModel.findOne({ order: body.order, product: body.product, createdBy: ireq.user });
        if (fetchedReview)
            throw utils_1.helper.buildError("You cant send multiple reviews for same product", 400);
        let order = yield models_1.orderModel.findOne({ _id: body.order, user: ireq.user });
        if (!order)
            throw utils_1.helper.buildError("No order found with this order id", 404);
        let orderToJson = order.toJSON();
        if (orderToJson.currentOrderStatus != interfaces_1.OrderStatus.DELIVERED) {
            throw utils_1.helper.buildError("You cant provide review for undelivered product", 400);
        }
        if (reviewFiles === null || reviewFiles === void 0 ? void 0 : reviewFiles.length)
            reviewFiles = reviewFiles.map((f) => f.Location);
        yield models_1.reviewModel.create(Object.assign(Object.assign({}, body), { reviewFiles, createdBy: ireq.user }));
        let productRatings = yield models_1.reviewModel.find({ product: body.product });
        let sumOfRating = yield models_1.reviewModel.aggregate([
            { $match: { product: body.product } },
            { $group: { _id: "$product", totalAmount: { $sum: "$rating" } } },
        ]);
        let noOfRating = (productRatings === null || productRatings === void 0 ? void 0 : productRatings.length) || 0;
        let productRating = ((((_a = sumOfRating[0]) === null || _a === void 0 ? void 0 : _a.totalAmount) || 0) / (noOfRating || 0)).toFixed(1);
        yield order.set({ reviewAvailable: true }).save();
        yield models_1.productModel.updateOne({ _id: body.product }, { $set: { ratingCount: noOfRating, rating: +productRating } });
    }
    catch (error) {
        throw error;
    }
});
// fetch product reviews
const getProductReviews = (productId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield models_1.reviewModel.find({ product: productId }).populate("createdBy");
    }
    catch (error) {
        throw error;
    }
});
// delete review
const deleteReview = (reviewId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let review = yield models_1.reviewModel.findById({ _id: reviewId });
        if (!review)
            throw utils_1.helper.buildError("No review found with this id", 404);
        let reviewToJson = review.toJSON();
        let productRatings = yield models_1.reviewModel.find({ product: reviewToJson.product, _id: { $ne: reviewId } });
        let sumOfRating = yield models_1.reviewModel.aggregate([
            { $match: { _id: { $ne: reviewId } } },
            { $group: { _id: "$product", totalAmount: { $sum: "$rating" } } },
        ]);
        let noOfRating = productRatings.length;
        let productRating = sumOfRating[0].totalAmount / noOfRating;
        yield models_1.productModel.updateOne({ _id: reviewToJson.product }, { $set: { ratingCount: noOfRating, rating: productRating } });
        yield review.delete();
    }
    catch (error) {
        throw error;
    }
});
// fetch product review
const getUserProductReview = (req, query) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let review = yield models_1.reviewModel
            .findOne({ product: query.productId, order: query.orderId, createdBy: req.user }, { commentText: 1, rating: 1, createdAt: 1 })
            .populate("createdBy");
        if (!review)
            throw utils_1.helper.buildError("No review found with this id", 404);
        return review;
    }
    catch (error) {
        throw error;
    }
});
const setAdminRating = (productId, body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let product = yield models_1.productModel.findOne({ _id: productId });
        if (!product)
            throw utils_1.helper.buildError("no product found with this id", 404);
        yield product.set({ adminRating: body.adminRating, ratingCount: body.ratingCount }).save();
    }
    catch (error) {
        throw error;
    }
});
exports.default = {
    addReview,
    getProductReviews,
    deleteReview,
    getUserProductReview,
    setAdminRating,
};
