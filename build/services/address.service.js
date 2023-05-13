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
utils_1.helper.loadEnvFile();
/**
 * save user's billing/shipping addresses
 */
const saveAddress = (req, data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // let dAddress = await deleveryAddressModel.findOne({ pincode: data.pinCode });
        // if (!dAddress) throw helper.buildError("Delivery not available in your area", 400);
        if (data.isDefault) {
            yield models_1.addressModel.updateMany({ user: req.user._id }, { $set: { isDefault: false } });
        }
        let oldAddresses = yield getAddresses(req);
        if (!(oldAddresses === null || oldAddresses === void 0 ? void 0 : oldAddresses.length))
            data.isDefault = true;
        return yield models_1.addressModel.create(Object.assign(Object.assign({}, data), { user: req.user._id }));
    }
    catch (error) {
        throw error;
    }
});
/**
 * fetch user's billing/shipping address
 */
const getAddress = (req, addressId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const oldAddress = yield models_1.addressModel.findOne({ _id: addressId, user: req.user._id });
        if (!oldAddress)
            throw utils_1.helper.buildError("No address found with this id", 404);
        return oldAddress;
    }
    catch (error) {
        throw error;
    }
});
/**
 * fetch user's billing/shipping addresses
 */
const getAddresses = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield models_1.addressModel
            .find({ isDefault: { $exists: true }, user: req.user._id })
            .sort({ isDefault: -1 })
            .lean();
    }
    catch (error) {
        throw error;
    }
});
/**
 * update user's billing/shipping addresses
 */
const updateAddress = (req, addressId, data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // let dAddress = await deleveryAddressModel.findOne({ pincode: data.pinCode });
        // if (!dAddress) throw helper.buildError("Delivery not available in your area", 400);
        const oldAddress = yield models_1.addressModel.findOne({ _id: addressId, user: req.user._id });
        if (!oldAddress)
            throw utils_1.helper.buildError("No address found with this id", 404);
        let addressObj = oldAddress.toJSON();
        if (!data.isDefault && addressObj.isDefault) {
            throw utils_1.helper.buildError("can't undefault your default address", 404);
        }
        let addressCount = yield models_1.addressModel.countDocuments({ user: req.user._id });
        if (addressCount == 1)
            data.isDefault = true;
        if (data.isDefault) {
            yield models_1.addressModel.updateMany({ _id: { $ne: addressId } }, { $set: { isDefault: false } });
        }
        yield oldAddress.set(data).save();
    }
    catch (error) {
        throw error;
    }
});
/**
 * delete user's billing/shipping address
 */
const deleteAddress = (req, addressId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const oldAddress = yield models_1.addressModel.findOne({ _id: addressId, user: req.user._id });
        if (!oldAddress)
            throw utils_1.helper.buildError("No address found with this id", 404);
        return yield oldAddress.remove();
    }
    catch (error) {
        throw error;
    }
});
/**
 * make default address
 */
const makeDefaultAddress = (req, addressId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let address = yield models_1.addressModel.findOne({ _id: addressId, user: req.user });
        if (!address)
            throw utils_1.helper.buildError("No address found with this id", 404);
        yield models_1.addressModel.updateMany({ user: req.user }, { $set: { isDefault: false } });
        yield address.set({ isDefault: true }).save();
    }
    catch (error) {
        throw error;
    }
});
exports.default = {
    saveAddress,
    getAddress,
    getAddresses,
    updateAddress,
    deleteAddress,
    makeDefaultAddress,
};
