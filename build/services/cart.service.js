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
const admin_service_1 = __importDefault(require("./admin.service"));
const bd_service_1 = __importDefault(require("./bd.service"));
const product_service_1 = __importDefault(require("./product.service"));
utils_1.helper.loadEnvFile();
const calculateShipCharge = (cartTotal) => __awaiter(void 0, void 0, void 0, function* () {
    let config = yield admin_service_1.default.getConfigInfo();
    let shippingCharge = 0;
    if (config.cartTotalPrice > 0) {
        if (cartTotal < config.cartTotalPrice) {
            shippingCharge = config.shippingCharge;
        }
    }
    return shippingCharge;
});
const getCartTotal = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { items } = yield bd_service_1.default.getBDProducts(userId);
        let cartItems = yield models_1.cartModel
            .find({ user: userId })
            .populate({ path: "product", select: "-variants" })
            .populate({ path: "vendor", select: "name" });
        const itemTotal = cartItems.reduce((amount, c) => {
            var _a;
            let total = 0;
            let existsInBDProduct = items.find((p) => {
                var _a;
                let item = p.toJSON();
                return ((_a = item === null || item === void 0 ? void 0 : item.product) === null || _a === void 0 ? void 0 : _a._id.toString()) == c.product._id.toString();
            });
            if (existsInBDProduct) {
                total = c.quantity * (c.variant.sellingPrice - ((_a = c.variant) === null || _a === void 0 ? void 0 : _a.badalDaloPrice) || 0) + amount;
            }
            else
                total = c.quantity * c.variant.sellingPrice + amount;
            return total;
        }, 0);
        const shippingCharges = 0;
        return {
            totalItem: (cartItems === null || cartItems === void 0 ? void 0 : cartItems.length) || 0,
            itemTotal,
            shippingCharges,
            total: itemTotal + shippingCharges,
        };
    }
    catch (error) {
        throw error;
    }
});
/**
 * check item is out of stock
 */
const checkOutOfStock = (productId, variantId, quantity, isCart) => __awaiter(void 0, void 0, void 0, function* () {
    let product = yield product_service_1.default.findProduct(productId);
    let productToJson = product.toJSON();
    let variant = productToJson.variants.find((v) => {
        return v._id.toString() == variantId.toString();
    });
    if (!variant)
        throw utils_1.helper.buildError("Product not available!", 404);
    variant = Object.assign(Object.assign({}, variant.variant), { _id: variant._id });
    if (!isCart)
        return { product, variant, cartItemQuantity: quantity };
    if (variant.quantity < 1)
        throw utils_1.helper.buildError("Out of stocks", 400);
    if (variant.quantity < quantity) {
        throw utils_1.helper.buildError(`Out of stock`, 400);
    }
    return { product, variant, cartItemQuantity: quantity };
});
/**
 * add item into cart handler
 */
const addCartItem = (req, productId, variantId, quantity, throwExistsError = true) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { variant, product } = yield checkOutOfStock(productId, variantId, quantity, true);
        const cItem = yield models_1.cartModel.findOne({
            product: productId,
            variant: variant,
            user: req.user._id,
        });
        if (cItem && !throwExistsError)
            return;
        if (cItem)
            throw utils_1.helper.buildError("Item already added", 200);
        let productObj = product.toJSON();
        yield models_1.cartModel.create({
            product: productId,
            vendor: productObj.vendor,
            variant,
            quantity,
            user: req.user._id,
        });
        return yield getCartTotal(req.user._id);
    }
    catch (error) {
        throw error;
    }
});
/**
 * delete item from cart handler
 */
const deleteCartItem = (req, itemId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cItem = yield models_1.cartModel.findOne({ _id: itemId, user: req.user._id });
        if (!cItem)
            throw utils_1.helper.buildError("No item found with this id", 404);
        yield cItem.remove();
        return yield getCartTotal(req.user._id);
    }
    catch (error) {
        throw error;
    }
});
/**
 * decrease item from cart handler
 */
const decreaseCartItem = (req, itemId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cItem = yield models_1.cartModel.findOne({ _id: itemId, user: req.user._id });
        if (!cItem)
            throw utils_1.helper.buildError("No item found with this id", 404);
        let cItemToJson = cItem.toJSON();
        if (cItemToJson.quantity > 1)
            yield cItem.set({ quantity: cItemToJson.quantity - 1 }).save();
        else
            yield cItem.remove();
        return yield getCartTotal(req.user._id);
    }
    catch (error) {
        throw error;
    }
});
/**
 * increase item from cart handler
 */
const increaseCartItem = (req, itemId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const cItem = yield models_1.cartModel.findOne({ _id: itemId, user: req.user._id });
        if (!cItem)
            throw utils_1.helper.buildError("No item found with this id", 404);
        let cItemToJson = cItem.toJSON();
        yield checkOutOfStock((_a = cItemToJson === null || cItemToJson === void 0 ? void 0 : cItemToJson.product) === null || _a === void 0 ? void 0 : _a.toString(), (_c = (_b = cItemToJson === null || cItemToJson === void 0 ? void 0 : cItemToJson.variant) === null || _b === void 0 ? void 0 : _b._id) === null || _c === void 0 ? void 0 : _c.toString(), (cItemToJson === null || cItemToJson === void 0 ? void 0 : cItemToJson.quantity) + 1, true);
        yield cItem.set({ quantity: cItemToJson.quantity + 1 }).save();
        return yield getCartTotal(req.user._id);
    }
    catch (error) {
        throw error;
    }
});
/**
 * get cart handler
 */
const getCart = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let bdItems = yield models_1.bdProductModel.find({ user: userId });
        let cartItems = yield models_1.cartModel
            .find({ user: userId })
            .populate({ path: "product", match: { deleted: false } })
            .lean();
        let itemTotal = 0;
        cartItems = cartItems.filter((ci) => ci.product);
        cartItems = cartItems.filter((ci) => {
            let exists = ci.product.variants.find((v) => v._id.toString() == ci.variant._id.toString());
            return exists ? true : false;
        });
        cartItems = cartItems.map((c) => {
            var _a, _b, _c, _d;
            c.isBadalDaloAvailable = false;
            c.isBadalDaloInfo = null;
            let amount = c.quantity * c.variant.sellingPrice;
            if (bdItems === null || bdItems === void 0 ? void 0 : bdItems.length) {
                let isExists = bdItems.find((w) => {
                    return w.product.toString() == c.product._id.toString() && w.variant.toString() == c.variant._id.toString();
                });
                if (isExists) {
                    c.isBadalDaloAvailable = true;
                    c.isBadalDaloInfo = isExists;
                    amount = c.quantity * c.variant.badalDaloPrice;
                }
            }
            c.totalQty = ((_b = (((_a = c === null || c === void 0 ? void 0 : c.product) === null || _a === void 0 ? void 0 : _a.variants) || [])) === null || _b === void 0 ? void 0 : _b.reduce((pv, cv) => pv + cv.variant.quantity, 0)) || 0;
            let pVariant = (_d = (((_c = c === null || c === void 0 ? void 0 : c.product) === null || _c === void 0 ? void 0 : _c.variants) || [])) === null || _d === void 0 ? void 0 : _d.find((v) => v._id.toString() == c.variant._id.toString());
            if (!pVariant)
                throw utils_1.helper.buildError("Something went wrong", 400);
            c.variant = Object.assign(Object.assign({}, pVariant.variant), { _id: pVariant._id });
            itemTotal += amount;
            // delete c.product.variants;
            return c;
        });
        let shipCharge = yield calculateShipCharge(itemTotal);
        return {
            items: cartItems,
            totalItem: (cartItems === null || cartItems === void 0 ? void 0 : cartItems.length) || 0,
            itemTotal,
            shippingCharges: shipCharge,
            total: itemTotal + shipCharge,
        };
    }
    catch (error) {
        yield clearCart(userId);
        throw error;
    }
});
/**
 * clear cart handler
 */
const clearCart = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield models_1.cartModel.deleteMany({ user: userId });
        return yield getCartTotal(userId);
    }
    catch (error) {
        throw error;
    }
});
/**
 * add items into cart handler
 */
const addCartItems = (req, items) => { var _a, items_1, items_1_1; return __awaiter(void 0, void 0, void 0, function* () {
    var _b, e_1, _c, _d;
    try {
        try {
            for (_a = true, items_1 = __asyncValues(items); items_1_1 = yield items_1.next(), _b = items_1_1.done, !_b;) {
                _d = items_1_1.value;
                _a = false;
                try {
                    let item = _d;
                    yield addCartItem(req, item.productId, item.variantId, item.quantity, false);
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
        return yield getCartTotal(req.user._id);
    }
    catch (error) {
        throw error;
    }
}); };
exports.default = {
    addCartItem,
    deleteCartItem,
    decreaseCartItem,
    increaseCartItem,
    getCart,
    clearCart,
    checkOutOfStock,
    addCartItems,
    getCartTotal,
};
