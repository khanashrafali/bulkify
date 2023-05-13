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
router.post("", isUserAuth_1.isUser, validator_1.default.saveBank, controllers_1.bankCtrl.saveBank);
router.get("", isUserAuth_1.isUser, controllers_1.bankCtrl.getBanks);
router.put("/:bankId", isUserAuth_1.isUser, validator_1.default.updateBank, controllers_1.bankCtrl.updateBank);
router.put("/default/:bankId", isUserAuth_1.isUser, validator_1.default.putSetDefaultBank, controllers_1.bankCtrl.putSetDefaultBank);
router.get("/:bankId", isUserAuth_1.isUser, validator_1.default.getBank, controllers_1.bankCtrl.getBank);
router.delete("/:bankId", isUserAuth_1.isUser, validator_1.default.deleteBank, controllers_1.bankCtrl.deleteBank);
exports.default = router;
