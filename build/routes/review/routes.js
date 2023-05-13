"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../../controllers");
const utils_1 = require("../../utils");
const interfaces_1 = require("../../utils/interfaces");
const isAdminAuth_1 = require("../middlewares/isAdminAuth");
const isAuth_1 = require("../middlewares/isAuth");
const validator_1 = __importDefault(require("./validator"));
const router = (0, express_1.Router)();
router.post("/", (0, isAuth_1.isAuth)(), utils_1.fileHandler.uploadProductFilesToS3("reviews").fields([{ name: "reviewFiles", maxCount: 5 }]), validator_1.default.postAddReview, controllers_1.reviewCtrl.postAddReview);
router.get("/user-review", (0, isAuth_1.isAuth)([interfaces_1.UserRole.SUPER_ADMIN, interfaces_1.UserRole.ADMIN, interfaces_1.UserRole.USER, interfaces_1.UserRole.VENDOR]), validator_1.default.getProductReview, controllers_1.reviewCtrl.getProductReview);
router.put("/admin-rating/:productId", isAdminAuth_1.isAdmin, validator_1.default.setAdminRating, controllers_1.reviewCtrl.setAdminRating);
router.get("/:productId", validator_1.default.getProductReviews, controllers_1.reviewCtrl.getProductReviews);
router.delete("/:reviewId", isAdminAuth_1.isAdmin, validator_1.default.deleteReview, controllers_1.reviewCtrl.deleteReview);
exports.default = router;
