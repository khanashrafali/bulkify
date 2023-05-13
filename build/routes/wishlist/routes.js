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
router.post("", isUserAuth_1.isUser, validator_1.default.addWishlistItem, controllers_1.wishlistController.addWishlistItem);
router.post("/bulk-products", isUserAuth_1.isUser, controllers_1.wishlistController.addWishlistItems);
router.delete("/:itemId", isUserAuth_1.isUser, validator_1.default.deleteWishlistItem, controllers_1.wishlistController.deleteWishlistItem);
router.get("/clear", isUserAuth_1.isUser, controllers_1.wishlistController.clearWishlist);
router.get("", isUserAuth_1.isUser, controllers_1.wishlistController.getWishlist);
exports.default = router;
