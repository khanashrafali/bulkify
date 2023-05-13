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
router.post("", isAdminAuth_1.isAdmin, validator_1.default.addPrice, controllers_1.priceCtrl.addPrice);
router.get("/by-key/:key", controllers_1.priceCtrl.fetchPriceByKey);
router.get("/:priceId", validator_1.default.deletePrice, controllers_1.priceCtrl.fetchPrice);
router.put("/:priceId", isAdminAuth_1.isAdmin, validator_1.default.updatePrice, controllers_1.priceCtrl.updatePrice);
router.get("", validator_1.default.getPrices, controllers_1.priceCtrl.getPrices);
router.delete("/:priceId", isAdminAuth_1.isAdmin, validator_1.default.deletePrice, controllers_1.priceCtrl.deletePrice);
exports.default = router;
