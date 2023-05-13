import { Controller, Get, Route, Security, Tags } from "tsoa";
import { ApiResponse } from "../models";

@Tags("Utility")
@Route("utils")
export class UtilController extends Controller {
  /**
   * @summary get product util
   */
  @Security("Bearer")
  @Get("product-utils")
  public async getProductUtil() {
    return {} as ApiResponse;
  }

  /**
   * @summary get filter dropdown
   */
  @Security("Bearer")
  @Get("filter-dropdown")
  public async getFilterDropdown() {
    return {} as ApiResponse;
  }
}
