"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const postCreatePayout = [
    (0, express_validator_1.body)("payouts", "Please enter valid payouts").exists().isArray({ min: 1 }),
    (0, express_validator_1.body)("payouts.*.order", "Please enter valid order").exists().isMongoId(),
    (0, express_validator_1.body)("payouts.*.vendor", "Please enter valid vendor").exists().isMongoId(),
    (0, express_validator_1.body)("payouts.*.payoutAmount", "Please enter valid payoutAmount").exists().isInt({ gt: 0 }),
    (0, express_validator_1.body)("payouts.*.orderAmount", "Please enter valid orderAmount").exists().isInt({ gt: 0 }),
    (0, express_validator_1.body)("payouts.*.msg", "Please enter valid msg").optional().trim(),
    (0, express_validator_1.body)("payouts.*.orderId", "Please enter valid orderId").exists().trim().notEmpty(),
    (0, express_validator_1.body)("payouts.*.paymentMethod", "Please enter valid paymentMethod").exists().trim().notEmpty(),
];
const getPayout = [(0, express_validator_1.param)("payoutId", "Please enter valid payoutId").exists().isMongoId()];
const getPayouts = [
    (0, express_validator_1.query)("textSearch", "Please enter valid textSearch").optional().trim().notEmpty(),
    (0, express_validator_1.query)("page", "Please enter valid page").optional().toInt().isInt({ gt: 0 }),
    (0, express_validator_1.query)("pageSize", "Please enter valid pageSize").optional().toInt().isInt({ gt: 0 }),
];
exports.default = {
    postCreatePayout,
    getPayout,
    getPayouts,
};
