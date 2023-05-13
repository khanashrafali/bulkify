import { Body, Controller, Delete, Get, Path, Post, Put, Route, Security, Tags } from "tsoa";
import { ApiResponse, TSOACart } from "../models";

@Security("Bearer")
@Tags("Cart")
@Route("cart")
export class CartController extends Controller {
  
  /**
   * @summary Add Item on cart
   */
  @Post("")
  public async addItem(@Body() requestBody: { productId: string; variantId: string; quantity: number }) {
    return {} as ApiResponse;
  }

  /**
   * @summary Add Bulk Item on cart
   */
  @Post("bulk-products")
  public async addBulkItem(
    @Body() requestBody: { items: { productId: string; variantId: string; quantity: number }[] }
  ) {
    return {} as ApiResponse;
  }

  /**
   * @summary decrease item quantity
   */
  @Put("decrease/{itemId}")
  public async decreaseItem(@Path() itemId: string) {
    return {} as ApiResponse;
  }

  /**
   * @summary increase item quantity
   */
  @Put("increase/{itemId}")
  public async increaseItem(@Path() itemId: string) {
    return {} as ApiResponse;
  }

  /**
   * @summary remove item from cart
   */
  @Delete("{itemId}")
  public async removeItem(@Path() itemId: string) {
    return {} as ApiResponse;
  }

  /**
   * @summary clear cart
   */
  @Get("clear")
  public async clearCart() {
    return {} as ApiResponse;
  }

  /**
   * @summary get cart info
   */
  @Get("")
  public async getCartInfo() {
    return {} as TSOACart[];
  }
}
