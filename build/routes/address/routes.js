"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../../controllers");
const isUserAuth_1 = require("../middlewares/isUserAuth");
const validator_1 = __importDefault(require("./validator"));
const router = (0, express_1.Router)();
router.post("", isUserAuth_1.isUser, controllers_1.addressCtrl.postSaveAddress);
router.get("", isUserAuth_1.isUser, controllers_1.addressCtrl.getAddresses);
router.put("/:addressId", isUserAuth_1.isUser, validator_1.default.putUpdateAddress, controllers_1.addressCtrl.putUpdateAddress);
router.put("/default/:addressId", isUserAuth_1.isUser, validator_1.default.getAddress, controllers_1.addressCtrl.putSetDefaultAddress);
router.get("/:addressId", isUserAuth_1.isUser, validator_1.default.getAddress, controllers_1.addressCtrl.getAddress);
router.delete("/:addressId", isUserAuth_1.isUser, validator_1.default.deleteAddress, controllers_1.addressCtrl.deleteAddress);
exports.default = router;
