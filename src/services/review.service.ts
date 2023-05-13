import { orderModel, reviewModel, productModel } from "../models";
import { fileHandler, helper } from "../utils";
import { IRequest, OrderStatus, PaymentStatus } from "../utils/interfaces";

helper.loadEnvFile();

// add review
const addReview = async (ireq: IRequest, reviewFiles: any[], body: any) => {
  try {
    let fetchedReview = await reviewModel.findOne({ order: body.order, product: body.product, createdBy: ireq.user });
    if (fetchedReview) throw helper.buildError("You cant send multiple reviews for same product", 400);

    let order = await orderModel.findOne({ _id: body.order, user: ireq.user });
    if (!order) throw helper.buildError("No order found with this order id", 404);
    let orderToJson: any = order.toJSON();

    if (orderToJson.currentOrderStatus != OrderStatus.DELIVERED) {
      throw helper.buildError("You cant provide review for undelivered product", 400);
    }

    if (reviewFiles?.length) reviewFiles = reviewFiles.map((f) => f.Location);

    await reviewModel.create({ ...body, reviewFiles, createdBy: ireq.user });
    let productRatings = await reviewModel.find({ product: body.product });

    let sumOfRating = await reviewModel.aggregate([
      { $match: { product: body.product } },
      { $group: { _id: "$product", totalAmount: { $sum: "$rating" } } },
    ]);

    let noOfRating = productRatings?.length || 0;
    let productRating = ((sumOfRating[0]?.totalAmount || 0) / (noOfRating || 0)).toFixed(1);

    await order.set({ reviewAvailable: true }).save();
    await productModel.updateOne({ _id: body.product }, { $set: { ratingCount: noOfRating, rating: +productRating } });
  } catch (error) {
    throw error;
  }
};

// fetch product reviews
const getProductReviews = async (productId: string) => {
  try {
    return await reviewModel.find({ product: productId }).populate("createdBy");
  } catch (error) {
    throw error;
  }
};

// delete review
const deleteReview = async (reviewId: string) => {
  try {
    let review = await reviewModel.findById({ _id: reviewId });
    if (!review) throw helper.buildError("No review found with this id", 404);

    let reviewToJson: any = review.toJSON();
    let productRatings = await reviewModel.find({ product: reviewToJson.product, _id: { $ne: reviewId } });

    let sumOfRating = await reviewModel.aggregate([
      { $match: { _id: { $ne: reviewId } } },
      { $group: { _id: "$product", totalAmount: { $sum: "$rating" } } },
    ]);

    let noOfRating = productRatings.length;
    let productRating = sumOfRating[0].totalAmount / noOfRating;
    await productModel.updateOne(
      { _id: reviewToJson.product },
      { $set: { ratingCount: noOfRating, rating: productRating } }
    );
    await review.delete();
  } catch (error) {
    throw error;
  }
};

// fetch product review
const getUserProductReview = async (req: IRequest, query: any) => {
  try {
    let review = await reviewModel
      .findOne(
        { product: query.productId, order: query.orderId, createdBy: req.user },
        { commentText: 1, rating: 1, createdAt: 1 }
      )
      .populate("createdBy");

    if (!review) throw helper.buildError("No review found with this id", 404);
    return review;
  } catch (error) {
    throw error;
  }
};

const setAdminRating = async (productId: string, body: any) => {
  try {
    let product = await productModel.findOne({ _id: productId });
    if (!product) throw helper.buildError("no product found with this id", 404);
    await product.set({ adminRating: body.adminRating, ratingCount: body.ratingCount }).save();
  } catch (error) {
    throw error;
  }
};

export default {
  addReview,
  getProductReviews,
  deleteReview,
  getUserProductReview,
  setAdminRating,
};
