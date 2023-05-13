"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const utils_1 = require("../../utils");
const getUsers = [
    (0, express_validator_1.query)("createdAt", "Please enter valid createdAt").optional().isDate({
        format: utils_1.CONSTANT.DATE,
    }),
    (0, express_validator_1.query)("isActive", "Please enter valid isActive").optional().isIn(["true", "false"]).toBoolean(),
    (0, express_validator_1.query)("page", "Please enter valid page").optional().toInt().isInt({ gt: 0 }),
    (0, express_validator_1.query)("pageSize", "Please enter valid pageSize").optional().toInt().isInt({ gt: 0 }),
    (0, express_validator_1.query)("status", "Please enter valid status").optional().toBoolean(),
];
const postAddAdmin = [
    (0, express_validator_1.body)("name", "Please enter valid name").exists().trim().notEmpty(),
    (0, express_validator_1.body)("email", "Please enter valid email").exists().trim().notEmpty().isEmail().normalizeEmail(),
    (0, express_validator_1.body)("adminRole", "Please enter valid adminRole").exists().isMongoId(),
];
const patchUpdateAdminActiveStatus = [
    (0, express_validator_1.param)("adminId", "Please enter valid adminId").exists().isMongoId(),
    (0, express_validator_1.body)("status", "Please enter valid status").exists().isBoolean(),
];
exports.default = {
    getUsers,
    postAddAdmin,
    patchUpdateAdminActiveStatus,
};
