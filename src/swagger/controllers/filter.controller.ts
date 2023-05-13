import { Body, Controller, Delete, Get, Patch, Path, Post, Put, Route, Security, Tags } from "tsoa";
import { FilterResponse, FiltersResponse } from "../models";

@Tags("Filter")
@Route("filter")
@Security("Bearer")
export class FilterController extends Controller {
  /**
   * @summary Add Fliter
   */
  @Post("")
  public async addFliter(
    @Body()
    requestBody: {
      categories: string[];
      heading: string;
      items: string[];
    }
  ) {
    return {} as FilterResponse;
  }

  /**
   * @summary Update Fliter
   */
  @Put("{fliterId}")
  public async updateFliter(
    @Path() fliterId: string,
    @Body()
    requestBody: {
      categories: string[];
      heading: string;
      items: string[];
    }
  ) {
    return {} as FilterResponse;
  }

  /**
   * @summary fetch Fliteres
   */
  @Get("")
  public async getFliteres() {
    return {} as FiltersResponse;
  }

  /**
   * @summary fetch Fliter By id
   */
  @Get("{fliterId}")
  public async getFliter(@Path() fliterId: string) {
    return {} as FilterResponse;
  }

  /**
   * @summary update Fliter status By id
   */
  @Patch("{fliterId}")
  public async updateFliterStatus(
    @Path() fliterId: string,
    @Body()
    requestBody: {
      status: boolean;
    }
  ) {
    return {} as FilterResponse;
  }

  /**
   * @summary Delete Fliter
   */
  @Delete("{fliterId}")
  public async deleteFliter(@Path() fliterId: string) {
    return {} as FilterResponse;
  }
}
