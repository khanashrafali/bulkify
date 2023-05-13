import { Router } from "express";
import { reviewCtrl } from "../../controllers";
import { fileHandler } from "../../utils";
import { UserRole } from "../../utils/interfaces";
import { isAdmin } from "../middlewares/isAdminAuth";
import { isAuth } from "../middlewares/isAuth";
import validator from "./validator";

const router = Router();

router.post(
  "/",
  isAuth(),
  fileHandler.uploadProductFilesToS3("reviews").fields([{ name: "reviewFiles", maxCount: 5 }]),
  validator.postAddReview,
  reviewCtrl.postAddReview
);
router.get(
  "/user-review",
  isAuth([UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.USER, UserRole.VENDOR]),
  validator.getProductReview,
  reviewCtrl.getProductReview
);

router.put("/admin-rating/:productId", isAdmin, validator.setAdminRating, reviewCtrl.setAdminRating);

router.get("/:productId", validator.getProductReviews, reviewCtrl.getProductReviews);
router.delete("/:reviewId", isAdmin, validator.deleteReview, reviewCtrl.deleteReview);

export default router;
