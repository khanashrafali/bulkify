import { Body, Controller, Delete, Get, Path, Post, Put, Route, Security, Tags } from "tsoa";
import { ContentResponse, ContentsResponse } from "../models";

@Tags("Content")
@Route("content")
@Security("Bearer")
export class ContentController extends Controller {
  /**
   * @summary Add Content
   */
  @Post("")
  public async addContent(
    @Body()
    requestBody: {
      title: string;
      subTitle: string;
      sortDescription: string;
      description: string;
    }
  ) {
    return {} as ContentResponse;
  }

  /**
   * @summary Update Content
   */
  @Put("{contentId}")
  public async updateContent(
    @Path() contentId: string,
    @Body()
    requestBody: {
      title: string;
      subTitle: string;
      sortDescription: string;
      description: string;
    }
  ) {
    return {} as ContentResponse;
  }

  /**
   * @summary fetch Contentes
   */
  @Get("")
  public async getContentes() {
    return {} as ContentResponse;
  }

  /**
   * @summary fetch Content By id
   */
  @Get("{contentId}")
  public async getContent(@Path() contentId: string) {
    return {} as ContentResponse;
  }

  /**
   * @summary Delete Content
   */
  @Delete("{contentId}")
  public async deleteContent(@Path() contentId: string) {
    return {} as ContentResponse;
  }
}
