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
 * save user's billing/shipping banks
 */
const addBank = (req, data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (data.isDefault)
            yield models_1.bankModel.updateMany({ user: req.user._id }, { $set: { isDefault: false } });
        return yield models_1.bankModel.create(Object.assign(Object.assign({}, data), { user: req.user._id }));
    }
    catch (error) {
        throw error;
    }
});
/**
 * fetch user's billing/shipping bank
 */
const getBank = (req, bankId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const oldAddress = yield models_1.bankModel.findOne({ _id: bankId, user: req.user._id });
        if (!oldAddress)
            throw utils_1.helper.buildError("No bank found with this id", 404);
        return oldAddress;
    }
    catch (error) {
        throw error;
    }
});
/**
 * fetch user's billing/shipping banks
 */
const getBanks = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield models_1.bankModel
            .find({ isDefault: { $exists: true }, user: req.user._id })
            .sort({ isDefault: -1 })
            .lean();
    }
    catch (error) {
        throw error;
    }
});
/**
 * update user's billing/shipping banks
 */
const updateBank = (req, bankId, data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (data.isDefault)
            yield models_1.bankModel.updateMany({ _id: { $ne: bankId } }, { $set: { isDefault: false } });
        const oldAddress = yield models_1.bankModel.findOne({ _id: bankId, user: req.user._id });
        if (!oldAddress)
            throw utils_1.helper.buildError("No bank found with this id", 404);
        yield oldAddress.set(data).save();
    }
    catch (error) {
        throw error;
    }
});
/**
 * delete user's billing/shipping bank
 */
const deleteBank = (req, bankId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const oldAddress = yield models_1.bankModel.findOne({ _id: bankId, user: req.user._id });
        if (!oldAddress)
            throw utils_1.helper.buildError("No bank found with this id", 404);
        return yield oldAddress.remove();
    }
    catch (error) {
        throw error;
    }
});
/**
 * make default bank
 */
const makeDefaultBank = (req, bankId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let bank = yield models_1.bankModel.findOne({ _id: bankId, user: req.user });
        if (!bank)
            throw utils_1.helper.buildError("No bank found with this id", 404);
        yield models_1.bankModel.updateMany({ user: req.user }, { $set: { isDefault: false } });
        yield bank.set({ isDefault: true }).save();
    }
    catch (error) {
        throw error;
    }
});
exports.default = {
    addBank,
    getBank,
    getBanks,
    updateBank,
    deleteBank,
    makeDefaultBank,
};
