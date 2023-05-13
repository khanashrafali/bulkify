"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../../controllers");
const utils_1 = require("../../utils");
const isUserAuth_1 = require("../middlewares/isUserAuth");
const validator_1 = __importDefault(require("./validator"));
const router = (0, express_1.Router)();
router.post("", isUserAuth_1.isUser, utils_1.fileHandler.uploadProductFilesToS3("cart-badaldalo").single("file"), validator_1.default.addBDProduct, controllers_1.bdController.addBDProduct);
router.delete("/:productId/:variantId", isUserAuth_1.isUser, validator_1.default.deleteDBProduct, controllers_1.bdController.deleteDBProduct);
router.get("/clear", isUserAuth_1.isUser, controllers_1.bdController.clearBDProducts);
router.get("", isUserAuth_1.isUser, controllers_1.bdController.getBDProducts);
exports.default = router;
