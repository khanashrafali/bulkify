import { Body, Controller, Delete, Get, Patch, Path, Post, Put, Query, Route, Security, Tags } from "tsoa";
import { CollectionReqBody, CollectionResponse, CollectionsResponse } from "../models";

@Tags("Collections")
@Route("collections")
export class CollectionController extends Controller {
  /**
   * @summary Create new collection
   */
  @Security("Bearer")
  @Post("")
  public async createCollection(@Body() requestBody: CollectionReqBody) {
    return {} as CollectionResponse;
  }

  /**
   * @summary Update existing collection
   */
  @Security("Bearer")
  @Put("{collectionId}")
  async updateCollection(@Path() collectionId: string, @Body() requestBody: CollectionReqBody) {
    return {} as CollectionResponse;
  }

  /**
   * @summary Update existing collection active status
   */
  @Security("Bearer")
  @Patch("{collectionId}")
  public async updateCollectionStatus(@Path() collectionId: string, @Body() requestBody: { status: boolean }) {
    return {} as CollectionResponse;
  }

  /**
   * @summary Update existing collection featured status
   */
  @Security("Bearer")
  @Patch("featured/{collectionId}")
  public async updateCollectionFeaturedStatus(@Path() collectionId: string, @Body() requestBody: { isFeatured: boolean }) {
    return {} as CollectionResponse;
  }

  /**
   * @summary Delete existing collection
   */
  @Security("Bearer")
  @Delete("{collectionId}")
  public async deleteCollection(@Path() collectionId: string) {
    return {} as CollectionResponse;
  }

  /**
   * @summary fetch collections by admin
   */
  @Security("Bearer")
  @Get("by-admin")
  public async getCollectionsByAdmin(
    @Query() page?: string,
    @Query() pageSize?: string,
    @Query() status?: boolean,
    @Query() createdAt?: Date,
    @Query() isFeatured?: boolean
  ) {
    return {} as CollectionsResponse;
  }

  /**
   * @summary fetch collections
   */
  @Get("")
  public async getCollections(
    @Query() page?: string,
    @Query() pageSize?: string,
    @Query() status?: boolean,
    @Query() createdAt?: Date,
    @Query() isFeatured?: boolean
  ) {
    return {} as CollectionsResponse;
  }

  /**
   * @summary fetch single collection details
   */
  @Get("/{collectionId}")
  public async getCollectionById(@Path() collectionId: string) {
    return {} as CollectionResponse;
  }
}
