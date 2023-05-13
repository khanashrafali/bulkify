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
const postAddCartItem = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        let result = yield services_1.cartService.addCartItem(req, req.body.productId, req.body.variantId, req.body.quantity);
        utils_1.helper.buildResponse(res, "Item added To Cart", result);
    }
    catch (error) {
        next(error);
    }
});
/**
 * remove item from cart api
 */
const putDecreaseItemQuantity = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        yield services_1.cartService.decreaseCartItem(req, req.params.itemId);
        utils_1.helper.buildResponse(res, "Item removed from Cart");
    }
    catch (error) {
        next(error);
    }
});
/**
 * add item to cart api
 */
const putIncreaseItemQuantity = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        yield services_1.cartService.increaseCartItem(req, req.params.itemId);
        utils_1.helper.buildResponse(res, "Item added to Cart");
    }
    catch (error) {
        next(error);
    }
});
/**
 * delete item from cart api
 */
const deleteCartItem = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        let result = yield services_1.cartService.deleteCartItem(req, req.params.itemId);
        utils_1.helper.buildResponse(res, "Item deleted from Cart", result);
    }
    catch (error) {
        next(error);
    }
});
/**
 * get user cart api
 */
const getCart = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        let result = yield services_1.cartService.getCart(req.user._id);
        utils_1.helper.buildResponse(res, "Cart fetched successfully", result);
    }
    catch (error) {
        next(error);
    }
});
/**
 * clear user cart api
 */
const getClearCart = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        yield services_1.cartService.clearCart(req.user._id);
        utils_1.helper.buildResponse(res, "Cart cleared successully");
    }
    catch (error) {
        next(error);
    }
});
/**
 * add items to cart api
 */
const postAddCartItems = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        yield services_1.cartService.addCartItems(req, req.body.items);
        utils_1.helper.buildResponse(res, "Items added To Cart");
    }
    catch (error) {
        next(error);
    }
});
exports.default = {
    postAddCartItem,
    putDecreaseItemQuantity,
    putIncreaseItemQuantity,
    deleteCartItem,
    getCart,
    getClearCart,
    postAddCartItems,
};
