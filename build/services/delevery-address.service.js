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
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../models");
const utils_1 = require("../utils");
utils_1.helper.loadEnvFile();
const addDeleveryAddress = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield models_1.deleveryAddressModel.create(data);
    }
    catch (error) {
        throw error;
    }
});
const updateDeleveryAddress = (addressId, data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let address = yield models_1.deleveryAddressModel.findOne({ _id: addressId });
        if (!address)
            throw utils_1.helper.buildError("no address found with this id", 404);
        yield address.set(data).save();
    }
    catch (error) {
        throw error;
    }
});
const getDeleveryAddress = (addressId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let address = yield models_1.deleveryAddressModel.findOne({ _id: addressId });
        if (!address)
            throw utils_1.helper.buildError("no address found with this id", 404);
        return address;
    }
    catch (error) {
        throw error;
    }
});
const getDeleveryAddresses = (queryParams) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let conditions = {};
        const pageInfo = utils_1.helper.checkPagination(queryParams);
        if ("pincode" in queryParams)
            conditions.pincode = queryParams.pincode;
        let mongoQuery = models_1.deleveryAddressModel.find(conditions);
        const count = yield models_1.deleveryAddressModel.countDocuments(conditions);
        let docs = [];
        if (pageInfo)
            docs = yield mongoQuery.skip(pageInfo.skip).limit(pageInfo.pageSize);
        else
            docs = yield mongoQuery;
        return utils_1.helper.makePaginatedData(docs, count, pageInfo);
    }
    catch (error) {
        throw error;
    }
});
const deleteDeleveryAddress = (addressId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let address = yield models_1.deleveryAddressModel.findOne({ _id: addressId });
        if (!address)
            throw utils_1.helper.buildError("no address found with this id", 404);
        yield address.remove();
    }
    catch (error) {
        throw error;
    }
});
const uploadAddress = (locations) => { var _a, locations_1, locations_1_1; return __awaiter(void 0, void 0, void 0, function* () {
    var _b, e_1, _c, _d;
    try {
        try {
            for (_a = true, locations_1 = __asyncValues(locations); locations_1_1 = yield locations_1.next(), _b = locations_1_1.done, !_b;) {
                _d = locations_1_1.value;
                _a = false;
                try {
                    let p = _d;
                    let address = yield models_1.deleveryAddressModel.findOne({ pincode: p.pincode });
                    if (!address)
                        yield models_1.deleveryAddressModel.create({ pincode: p.pincode });
                }
                finally {
                    _a = true;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_a && !_b && (_c = locations_1.return)) yield _c.call(locations_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    }
    catch (error) {
        throw error;
    }
}); };
exports.default = {
    addDeleveryAddress,
    updateDeleveryAddress,
    getDeleveryAddress,
    getDeleveryAddresses,
    deleteDeleveryAddress,
    uploadAddress,
};
