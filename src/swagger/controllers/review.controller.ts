import { Body, Controller, Delete, Get, Path, Post, Route, Security, Tags } from "tsoa";
import { ReviewResponse, ReviewsResponse } from "../models";

@Tags("Reviews")
@Route("review")
export class ReviewController extends Controller {
  /**
   * @summary get reviews by product id
   */
  @Get("{productId}")
  public async getReviewsByProduct(@Path() productId: string) {
    return {} as ReviewsResponse;
  }

  /**
   * @summary get review by product id
   */
  @Security("Bearer")
  @Get("user-review/{productId}")
  public async getReviewByProduct(@Path() productId: string) {
    return {} as ReviewResponse;
  }

  /**
   * @summary add review
   */
  @Security("Bearer")
  @Post("")
  public async loginUser(
    @Body()
    requestBody: {
      orderId: string;
      productId: string;
      commentText: string;
      rating: number;
    }
  ) {
    return {} as ReviewResponse;
  }

  /**
   * @summary delete review
   */
  @Security("Bearer")
  @Delete("{reviewId}")
  public async loginAdmin(@Path() reviewId: string) {
    return {} as ReviewResponse;
  }
}
