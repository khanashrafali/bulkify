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
const addBDProduct = (req, product, variant, comment, file) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cItem = yield models_1.bdProductModel.findOne({ product, variant, user: req.user._id });
        if (cItem)
            throw utils_1.helper.buildError("Item already added", 200);
        yield models_1.bdProductModel.create({ product, variant, comment, file, user: req.user._id });
    }
    catch (error) {
        throw error;
    }
});
const deleteDBProduct = (userId, productId, variantId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cItem = yield models_1.bdProductModel.findOne({ product: productId, variant: variantId, user: userId });
        if (!cItem)
            throw utils_1.helper.buildError("No item found with this id", 404);
        yield cItem.remove();
    }
    catch (error) {
        throw error;
    }
});
const getBDProducts = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let items = yield models_1.bdProductModel.find({ user: userId }).populate({ path: "product" });
        return { items };
    }
    catch (error) {
        throw error;
    }
});
const clearBDProducts = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, e_1, _b, _c;
    try {
        let cartData = yield cart_service_1.default.getCart(userId);
        try {
            for (var _d = true, _e = __asyncValues(cartData.items), _f; _f = yield _e.next(), _a = _f.done, !_a;) {
                _c = _f.value;
                _d = false;
                try {
                    let item = _c;
                    yield models_1.bdProductModel.deleteMany({
                        product: item.product._id.toString(),
                        variant: item.variant._id.toString(),
                        user: userId,
                    });
                }
                finally {
                    _d = true;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_d && !_a && (_b = _e.return)) yield _b.call(_e);
            }
            finally { if (e_1) throw e_1.error; }
        }
    }
    catch (error) {
        throw error;
    }
});
exports.default = {
    addBDProduct,
    deleteDBProduct,
    getBDProducts,
    clearBDProducts,
};
