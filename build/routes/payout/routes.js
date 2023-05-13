"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../../controllers");
const isAdminAuth_1 = require("../middlewares/isAdminAuth");
const validator_1 = __importDefault(require("./validator"));
const router = (0, express_1.Router)();
router.post("", isAdminAuth_1.isAdmin, isAdminAuth_1.isAdmin, validator_1.default.postCreatePayout, controllers_1.transactionCtrl.postCreatePayout);
router.get("/:payoutId", isAdminAuth_1.isAdmin, validator_1.default.getPayout, controllers_1.transactionCtrl.getPayout);
router.get("", isAdminAuth_1.isAdmin, validator_1.default.getPayouts, controllers_1.transactionCtrl.getPayouts);
exports.default = router;
