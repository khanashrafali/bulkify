import { body, param, query } from "express-validator";

const postAddReview: any[] = [
  body("order", "Please enter valid orderId").exists().isMongoId(),
  body("product", "Please enter valid productId").exists().isMongoId(),
  body("commentText", "Please enter valid commentText").trim(),
  body("rating", "Please enter valid rating")
    .exists()
    .toFloat()
    .isFloat({ gt: 0.9, lt: 5.1 })
    .withMessage("Rating must be greator then 0 and equal to 5"),
];

const getProductReviews: any[] = [param("productId", "Please enter valid productId").exists().isMongoId()];

const deleteReview: any[] = [param("reviewId", "Please enter valid reviewId").exists().isMongoId()];

const getProductReview = [
  query("productId", "Please enter valid productId").exists().trim().notEmpty().isMongoId(),
  query("orderId", "Please enter valid orderId").exists().trim().notEmpty().isMongoId(),
];

const setAdminRating = [
  body("adminRating", "Please enter valid adminRating").exists().isFloat({ gt: -1, lt: 5.1 }),
  param("productId", "Please enter valid productId").exists().trim().notEmpty().isMongoId(),
];

export default {
  postAddReview,
  getProductReviews,
  deleteReview,
  getProductReview,
  setAdminRating,
};
