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
        if ((_a = req.params) === null || _a === void 0 ? void 0 : _a.addressId)
            conditions._id = { $ne: (_b = req.params) === null || _b === void 0 ? void 0 : _b.addressId };
        const address = yield models_1.addressModel.findOne(conditions);
        if (address)
            throw utils_1.helper.buildError("same address tag already exists", 400);
    }
    catch (error) {
        throw error;
    }
});
const postSaveAddress = [
    // body("tag", "Please enter valid tag").exists().trim().notEmpty().custom(checkDuplicateAddressTag),
    // body("email", "Please enter valid email").exists().trim().notEmpty().isEmail().normalizeEmail(),
    (0, express_validator_1.body)("firstName", "Please enter valid firstName")
        .exists()
        .trim()
        .notEmpty()
        .isLength({ max: 100 })
        .withMessage("Length must be less then 100")
        .isAlpha("en-IN", { ignore: [".", " ", "_"] }),
    (0, express_validator_1.body)("lastName", "Please enter valid lastName")
        .exists()
        .trim()
        .notEmpty()
        .isLength({ max: 100 })
        .withMessage("Length must be less then 100")
        .isAlpha("en-IN", { ignore: [".", " ", "_"] }),
    (0, express_validator_1.body)("mobileNumber", "Please enter valid mobileNumber").exists().trim().notEmpty().isMobilePhone("en-IN"),
    (0, express_validator_1.body)("city", "Please enter valid city")
        .exists()
        .trim()
        .notEmpty()
        .isAlpha("en-IN", { ignore: [".", " ", ",", "&"] }),
    (0, express_validator_1.body)("state", "Please enter valid state"),
    (0, express_validator_1.body)("pinCode", "Please enter valid pin code").exists().trim().notEmpty().matches(utils_1.CONSTANT.REGX.Pincode),
    (0, express_validator_1.body)("address", "Please enter valid address").exists().trim().notEmpty(),
    (0, express_validator_1.body)("isDefault", "Please enter valid isDefault").exists().isBoolean(),
];
const getAddress = [(0, express_validator_1.param)("addressId", "Please enter valid addressId").exists().isMongoId()];
const putUpdateAddress = [...getAddress, ...postSaveAddress];
const deleteAddress = [...getAddress];
exports.default = {
    postSaveAddress,
    getAddress,
    putUpdateAddress,
    deleteAddress,
};
