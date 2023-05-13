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
const express_validator_1 = require("express-validator");
const models_1 = require("../../models");
const utils_1 = require("../../utils");
const checkDuplicateAddressTag = (val, { req }) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        let iReq = req;
        let conditions = { user: iReq.user._id, tag: val };
        if ((_a = req.params) === null || _a === void 0 ? void 0 : _a.bankId)
            conditions._id = { $ne: (_b = req.params) === null || _b === void 0 ? void 0 : _b.bankId };
        const address = yield models_1.bankModel.findOne(conditions);
        if (address)
            throw utils_1.helper.buildError("same address tag already exists", 400);
    }
    catch (error) {
        throw error;
    }
});
const saveBank = [
    (0, express_validator_1.body)("accountNumber", "Please enter valid accountNumber").exists().trim().notEmpty(),
    (0, express_validator_1.body)("holderName", "Please enter valid holderName").exists().trim().notEmpty(),
    (0, express_validator_1.body)("ifscCode", "Please enter valid ifscCode").exists().trim().notEmpty().matches(utils_1.CONSTANT.REGX.IFSC),
    (0, express_validator_1.body)("isDefault", "Please enter valid isDefault").exists().isBoolean(),
];
const getBank = [(0, express_validator_1.param)("bankId", "Please enter valid bankId").exists().isMongoId()];
const updateBank = [...getBank, ...saveBank];
const deleteBank = [...getBank];
const putSetDefaultBank = [...getBank];
exports.default = {
    saveBank,
    getBank,
    updateBank,
    deleteBank,
    putSetDefaultBank,
};
