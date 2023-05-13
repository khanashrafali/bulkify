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
const services_1 = require("../services");
const utils_1 = require("../utils");
/**
 * add item to cart api
 */
const addWishlistItem = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        let result = yield services_1.wishlistService.addWishlistItem(req, req.body.productId);
        utils_1.helper.buildResponse(res, `Item ${result.isAdded ? "added to" : "removed from"} Wishlist`, result.newItem);
    }
    catch (error) {
        next(error);
    }
});
/**
 * delete item from cart api
 */
const deleteWishlistItem = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        yield services_1.wishlistService.deleteWishlistItem(req, req.params.itemId);
        utils_1.helper.buildResponse(res, "Item deleted from Wishlist");
    }
    catch (error) {
        next(error);
    }
});
/**
 * get user cart api
 */
const getWishlist = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        let result = yield services_1.wishlistService.getWishlist(req);
        utils_1.helper.buildResponse(res, "Wishlist fetched successfully", result);
    }
    catch (error) {
        next(error);
    }
});
/**
 * clear user cart api
 */
const clearWishlist = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        yield services_1.wishlistService.clearWishlist(req);
        utils_1.helper.buildResponse(res, "Wishlist cleared successully");
    }
    catch (error) {
        next(error);
    }
});
/**
 * add items to cart api
 */
const addWishlistItems = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        yield services_1.wishlistService.addWishlistItems(req, req.body.items);
        utils_1.helper.buildResponse(res, "Items added To Wishlist");
    }
    catch (error) {
        next(error);
    }
});
exports.default = {
    addWishlistItem,
    deleteWishlistItem,
    getWishlist,
    clearWishlist,
    addWishlistItems,
};
