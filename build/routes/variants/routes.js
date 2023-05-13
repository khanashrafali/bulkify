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
router.post("", isAdminAuth_1.isAdmin, validator_1.default.addVariant, controllers_1.variantController.addVariant);
router.put("/:variantId", isAdminAuth_1.isAdmin, validator_1.default.updateVariant, controllers_1.variantController.updateVariant);
router.patch("/:variantId", isAdminAuth_1.isAdmin, validator_1.default.updateVariantStatus, controllers_1.variantController.updateVariantStatus);
router.get("/by-admin", validator_1.default.getVariants, controllers_1.variantController.getVariantsByAdmin);
router.get("/:variantId/by-admin", validator_1.default.getVariant, controllers_1.variantController.getVariantByAdmin);
router.get("/:variantId", validator_1.default.getVariant, controllers_1.variantController.getVariant);
router.delete("/:variantId", isAdminAuth_1.isAdmin, validator_1.default.deleteVariant, controllers_1.variantController.deleteVariant);
router.get("", validator_1.default.getVariants, controllers_1.variantController.getVariants);
exports.default = router;
