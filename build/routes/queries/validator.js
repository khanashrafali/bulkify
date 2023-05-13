"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const saveQueiry = [
    (0, express_validator_1.body)("name", "Please enter valid name").exists().trim().notEmpty(),
    (0, express_validator_1.body)("email", "Please enter valid email").exists().trim().notEmpty().isEmail().normalizeEmail(),
    (0, express_validator_1.body)("phone", "Please enter valid phone").exists().trim().notEmpty().isMobilePhone("en-IN"),
    (0, express_validator_1.body)("message", "Please enter valid message").exists().trim().notEmpty(),
    (0, express_validator_1.body)("subject", "Please enter valid subject").exists().trim().notEmpty(),
];
exports.default = {
    saveQueiry,
};
