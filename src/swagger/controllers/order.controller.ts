import { Body, Controller, Get, Path, Post, Put, Query, Route, Security, Tags } from "tsoa";
import { OrderStatus, PaymentMethod, PaymentStatus } from "../../utils/interfaces";
import { ApiResponse } from "../models";

@Tags("Orders")
@Route("order")
export class OrderController extends Controller {
  /**
   * @summary place order
   */
  @Security("Bearer")
  @Post("place-order")
  public async placeOrder(
    @Body()
    requestBody: {
      orderId: string;
      rpay_paymentId: string;
      rpay_orderId: string;
      rpay_signature: string;
      reasonMessage: string;
      shippingAddress: string;
    }
  ) {
    return {} as ApiResponse;
  }

  /**
   * @summary buy now order
   */
  @Security("Bearer")
  @Post("buy-now")
  public async buyNowOrder(
    @Body()
    requestBody: {
      shippingAddress: string;
    }
  ) {
    return {} as ApiResponse;
  }

  /**
   * @summary generate ship rocket order id
   */
  @Security("Bearer")
  @Post("create-rpay-order")
  public async getOrderId(@Body() requestBody: { couponCode?: string }) {
    return {} as ApiResponse;
  }

  /**
   * @summary cancel order
   */
  @Security("Bearer")
  @Put("{orderId}")
  public async cancelOrder(@Path() orderId: string) {
    return {} as ApiResponse;
  }

  /**
   * @summary cancel order item
   */
  @Security("Bearer")
  @Put("{orderId}/{orderItemId}")
  public async cancelOrderItem(@Path() orderId: string, @Path() orderItemId: string) {
    return {} as ApiResponse;
  }

  /**
   * @summary return order
   */
  @Security("Bearer")
  @Put("return/{orderId}")
  public async returnOrder(@Path() orderId: string) {
    return {} as ApiResponse;
  }

  /**
   * @summary get order
   */
  @Security("Bearer")
  @Get("{orderId}")
  public async getOrder(@Path() orderId: string) {
    return {} as ApiResponse;
  }

  /**
   * @summary get orders
   */
  @Security("Bearer")
  @Get("")
  public async getOrders(
    @Query() page?: number,
    @Query() pageSize?: number,
    @Query() textSearch?: string,
    @Query() paymentStatus?: PaymentStatus,
    @Query() orderStatus?: OrderStatus,
    @Query() createdAt?: Date
  ) {
    return {} as ApiResponse;
  }

  /**
   * @summary get order invoice
   */
  @Security("Bearer")
  @Get("{orderId}/invoice")
  public async getOrdersInvoice(@Path() orderId: string) {
    return {} as ApiResponse;
  }

  /**
   * @summary get orders by vendor
   */
  @Security("Bearer")
  @Get("by-vendor")
  public async getOrdersByVendor(
    @Query() page?: number,
    @Query() pageSize?: number,
    @Query() textSearch?: string,
    @Query() paymentStatus?: PaymentStatus,
    @Query() createdAt?: Date
  ) {
    return {} as ApiResponse;
  }

  /**
   * @summary get order by vendor
   */
  @Security("Bearer")
  @Get("by-vendor/{orderId}")
  public async getOrderByVendor(@Path() orderId: string) {
    return {} as ApiResponse;
  }

  /**
   * @summary get orders by admin
   */
  @Security("Bearer")
  @Get("by-admin")
  public async getOrdersByAdmin(
    @Query() page?: number,
    @Query() pageSize?: number,
    @Query() textSearch?: string,
    @Query() paymentStatus?: PaymentStatus,
    @Query() orderStatus?: OrderStatus,
    @Query() createdAt?: Date
  ) {
    return {} as ApiResponse;
  }

  /**
   * @summary get order by Admin
   */
  @Security("Bearer")
  @Get("by-admin/{orderId}")
  public async getOrderByAdmin(@Path() orderId: string) {
    return {} as ApiResponse;
  }

  /**
   * @summary get orders by user Id
   */
  @Security("Bearer")
  @Get("users/{userId}")
  public async getOrdersByUserId(
    @Path() userId: string,
    @Query() page?: number,
    @Query() pageSize?: number,
    @Query() textSearch?: string,
    @Query() paymentStatus?: PaymentStatus,
    @Query() orderStatus?: OrderStatus,
    @Query() createdAt?: Date
  ) {
    return {} as ApiResponse;
  }
}
