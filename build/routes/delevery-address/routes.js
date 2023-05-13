"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../../controllers");
const utils_1 = require("../../utils");
const isAdminAuth_1 = require("../middlewares/isAdminAuth");
const validator_1 = __importDefault(require("./validator"));
const router = (0, express_1.Router)();
router.post("", isAdminAuth_1.isAdmin, validator_1.default.addDeleveryAddress, controllers_1.deleveryController.addDeleveryAddress);
router.post("/upload", isAdminAuth_1.isAdmin, utils_1.fileHandler.uploadFile(["text/csv"]).single("file"), validator_1.default.validateParseCSV, controllers_1.deleveryController.uploadAddress);
router.put("/:id", isAdminAuth_1.isAdmin, validator_1.default.updateDeleveryAddress, controllers_1.deleveryController.updateDeleveryAddress);
router.get("/:id", validator_1.default.getDeleveryAddress, controllers_1.deleveryController.getDeleveryAddress);
router.delete("/:id", isAdminAuth_1.isAdmin, validator_1.default.deleteDeleveryAddress, controllers_1.deleveryController.deleteDeleveryAddress);
router.get("", validator_1.default.getDeleveryAddresses, controllers_1.deleveryController.getDeleveryAddresses);
exports.default = router;
