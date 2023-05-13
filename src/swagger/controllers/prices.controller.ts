import { Body, Controller, Delete, Get, Patch, Path, Post, Put, Route, Security, Tags } from "tsoa";
import { FilterResponse, FiltersResponse } from "../models";

@Tags("Prices")
@Route("prices")
@Security("Bearer")
export class PriceController extends Controller {
  /**
   * @summary Add Price
   */
  @Post("")
  public async addPrice(
    @Body()
    requestBody: {
      heading: string;
      prices: { from: number; to: number }[];
    }
  ) {
    return {} as FilterResponse;
  }

  /**
   * @summary Update Price
   */
  @Put("{priceId}")
  public async updatePrice(
    @Path() priceId: string,
    @Body()
    requestBody: {
      heading: string;
      prices: { from: number; to: number }[];
    }
  ) {
    return {} as FilterResponse;
  }

  /**
   * @summary fetch Pricees
   */
  @Get("")
  public async getPricees() {
    return {} as FiltersResponse;
  }

  /**
   * @summary fetch Price By id
   */
  @Get("{priceId}")
  public async getPrice(@Path() priceId: string) {
    return {} as FilterResponse;
  }

  /**
   * @summary Delete Price
   */
  @Delete("{priceId}")
  public async deletePrice(@Path() priceId: string) {
    return {} as FilterResponse;
  }
}
