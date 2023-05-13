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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../models");
const utils_1 = require("../utils");
const cart_service_1 = __importDefault(require("./cart.service"));
utils_1.helper.loadEnvFile();
/**
 * add item into cart handler
 */
const addWishlistItem = (req, productId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let newItem;
        let isAdded;
        const cItem = yield models_1.wishlistModel.findOne({ product: productId, user: req.user._id });
        if (cItem) {
            yield cItem.remove();
            isAdded = false;
        }
        else {
            newItem = yield models_1.wishlistModel.create({ product: productId, user: req.user._id });
            isAdded = true;
        }
        return { newItem, isAdded };
    }
    catch (error) {
        throw error;
    }
});
/**
 * delete item from cart handler
 */
const deleteWishlistItem = (req, itemId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cItem = yield models_1.wishlistModel.findOne({ _id: itemId, user: req.user._id });
        if (!cItem)
            throw utils_1.helper.buildError("No item found with this id", 404);
        yield cItem.remove();
    }
    catch (error) {
        throw error;
    }
});
/**
 * get cart handler
 */
const getWishlist = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { items: cartItems } = yield cart_service_1.default.getCart(req.user._id);
        let items = yield models_1.wishlistModel
            .find({ user: req.user._id })
            .populate({ path: "product", match: { deleted: false } });
        items = items.filter((wi) => wi.product);
        return {
            items: items.map((wi) => {
                let isExists = cartItems.find((ci) => {
                    var _a, _b;
                    return ((_a = ci.product) === null || _a === void 0 ? void 0 : _a._id.toString()) == ((_b = wi.product) === null || _b === void 0 ? void 0 : _b._id.toString());
                });
                let wiObj = wi.toJSON();
                if (isExists)
                    wiObj.product.isInCart = true;
                else
                    wiObj.product["isInCart"] = false;
                wiObj.totalQty = wiObj.product.variants.reduce((pv, cv) => pv + cv.variant.quantity, 0);
                return wiObj;
            }),
        };
    }
    catch (error) {
        throw error;
    }
});
/**
 * clear cart handler
 */
const clearWishlist = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield models_1.wishlistModel.deleteMany({ user: req.user._id });
    }
    catch (error) {
        throw error;
    }
});
/**
 * add items into cart handler
 */
const addWishlistItems = (req, items) => { var _a, items_1, items_1_1; return __awaiter(void 0, void 0, void 0, function* () {
    var _b, e_1, _c, _d;
    try {
        try {
            for (_a = true, items_1 = __asyncValues(items); items_1_1 = yield items_1.next(), _b = items_1_1.done, !_b;) {
                _d = items_1_1.value;
                _a = false;
                try {
                    let item = _d;
                    yield addWishlistItem(req, item.productId);
                }
                finally {
                    _a = true;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_a && !_b && (_c = items_1.return)) yield _c.call(items_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    }
    catch (error) {
        throw error;
    }
}); };
exports.default = {
    addWishlistItem,
    deleteWishlistItem,
    getWishlist,
    clearWishlist,
    addWishlistItems,
};
