import { Body, Controller, Get, Path, Post, Put, Query, Route, Security, Tags } from "tsoa";
import { CreateProduct, ProductResponse } from "../models";

@Tags("Invantory")
@Route("inventory")
@Security("Bearer")
export class InvantoryController extends Controller {
  /**
   * @summary update product inventory
   */
  @Put("update/{productId}")
  public async updateInvantory(
    @Path() productId: string,
    @Body()
    requestBody: CreateProduct
  ) {
    return {} as ProductResponse;
  }
}
