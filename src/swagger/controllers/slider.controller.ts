import { Body, Controller, Delete, Get, Path, Post, Put, Route, Security, Tags } from "tsoa";
import { AddressResponse, TSOASlide } from "../models";

@Tags("Slider")
@Route("slider")
export class SliderController extends Controller {
  /**
   * @summary Add slider slide
   */
  @Security("Bearer")
  @Post("")
  public async addSlider(
    @Body()
    requestBody: {
      tag: string;
      slides: {
        title: string;
        desc: string;
        imageUrl: string;
        redirectUrl: string;
      }[];
    }
  ) {
    return {} as AddressResponse;
  }

  /**
   * @summary Add slider slide
   */
  @Security("Bearer")
  @Put("{sliderId}")
  public async updateSlider(
    @Body()
    requestBody: {
      tag: string;
      slides: {
        title: string;
        desc: string;
        imageUrl: string;
        redirectUrl: string;
      }[];
    }
  ) {
    return {} as AddressResponse;
  }

  /**
   * @summary fetch slider
   */
  @Security("Bearer")
  @Get("")
  public async getSlider() {
    return {} as TSOASlide[];
  }

  /**
   * @summary Delete Slider
   */
  @Security("Bearer")
  @Delete("{slideId}")
  public async deleteSlider(@Path() slideId: string) {
    return {} as TSOASlide;
  }

  /**
   * @summary Delete Slider slide
   */
  @Security("Bearer")
  @Delete("{sliderId}/{slideId}")
  public async deleteSlide(@Path() sliderId: string, @Path() slideId: string) {
    return {} as TSOASlide;
  }
}
