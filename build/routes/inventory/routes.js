"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../../controllers");
const isVendorAuth_1 = require("../middlewares/isVendorAuth");
const validator_1 = __importDefault(require("./validator"));
const router = (0, express_1.Router)();
router.put("/update/:productId", isVendorAuth_1.isVendor, validator_1.default.updateProductStockData, controllers_1.inventoryCtrl.updateProductStockData);
exports.default = router;
