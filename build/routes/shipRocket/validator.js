"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const utils_1 = require("../../utils");
const postSaveAddress = [
    (0, express_validator_1.body)("pickup_location", "Please enter valid pickup_location").exists().trim().notEmpty(),
    (0, express_validator_1.body)("email", "Please enter valid email").exists().trim().notEmpty().isEmail().normalizeEmail(),
    (0, express_validator_1.body)("name", "Please enter valid name")
        .exists()
        .trim()
        .notEmpty()
        .isLength({ max: 100 })
        .withMessage("Length must be less then 100")
        .isAlpha("en-IN", { ignore: [".", " ", "_"] }),
    (0, express_validator_1.body)("phone", "Please enter valid mobileNumber").exists().trim().notEmpty().isMobilePhone("en-IN"),
    (0, express_validator_1.body)("address", "Please enter valid address")
        .optional({ checkFalsy: true })
        .exists()
        .trim()
        .notEmpty()
        .isLength({ min: 10 })
        .withMessage("Address Line 1 can't be less than 10 characters."),
    (0, express_validator_1.body)("address_2", "Please enter valid address_2").optional({ checkFalsy: true }).exists().trim(),
    (0, express_validator_1.body)("city", "Please enter valid city")
        .exists()
        .trim()
        .notEmpty()
        .isAlpha("en-IN", { ignore: [".", " ", ",", "&"] }),
    (0, express_validator_1.body)("pin_code", "Please enter valid pin code").exists().trim().notEmpty().matches(utils_1.CONSTANT.REGX.Pincode),
    (0, express_validator_1.body)("state", "Please enter valid state")
        .exists()
        .trim()
        .notEmpty()
        .isAlpha("en-IN", { ignore: [".", " ", ",", "&"] }),
];
exports.default = {
    postSaveAddress,
};
