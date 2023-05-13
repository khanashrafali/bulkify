import { Body, Controller, Delete, Get, Patch, Path, Post, Put, Query, Route, Security, Tags, UploadedFile } from "tsoa";
import { ApprovalStatus } from "../../utils/interfaces";
import { ApiResponse, CollectionsResponse, CreateProduct, ProductResponse, ProductsResponse } from "../models";

@Tags("Product")
@Route("products")
export class ProductController extends Controller {
  /**
   * @summary get products by collection id/slug
   */
  @Security("Bearer")
  @Get("collection/{cIdSlug}")
  public async getProductsByCollection(@Path() cIdSlug: string) {
    return {} as ProductsResponse;
  }

  /**
   * @summary Bulk Upload
   */
  @Security("Bearer")
  @Post("bulk-upload")
  public async bulkUplaod(@UploadedFile() data: Express.Multer.File) {
    return {} as ApiResponse;
  }

  /**
   * @summary Create new Product
   */
  @Security("Bearer")
  @Post("")
  public async createProduct(@Body() requestBody: CreateProduct) {
    return {} as ProductResponse;
  }

  /**
   * @summary Create new Product By Admin
   */
  @Security("Bearer")
  @Post("add/by-admin")
  public async createProductByAdmin(@Body() requestBody: CreateProduct) {
    return {} as ProductResponse;
  }

  /**
   * @summary Update Product
   */
  @Security("Bearer")
  @Put("{productId}")
  public async updateProduct(@Path() productId: string, @Body() requestBody: CreateProduct) {
    return {} as ProductResponse;
  }

  /**
   * @summary Update Product By Admin
   */
  @Security("Bearer")
  @Put(" update/by-admin/{productId}")
  public async updateProductByAdmin(@Path() productId: string, @Body() requestBody: CreateProduct) {
    return {} as ProductResponse;
  }

  /**
   * @summary Delete product
   */
  @Security("Bearer")
  @Delete("/{pId}")
  public async deleteProduct(@Path() pId: string) {
    return {} as ProductResponse;
  }

  /**
   * @summary fetch products by admin
   */
  @Security("Bearer")
  @Get("by-admin")
  public async getProductsByAdmin(
    @Query() page?: number,
    @Query() pageSize?: number,
    @Query() textSearch?: string,
    @Query() createdAt?: Date,
    @Query() isApproved?: ApprovalStatus,
    @Query() category?: string
  ) {
    return {} as ProductsResponse;
  }

  /**
   * @summary fetch products by vendor
   */
  @Security("Bearer")
  @Get("by-vendor")
  public async getProductsByVendor(
    @Query() page?: number,
    @Query() pageSize?: number,
    @Query() textSearch?: string,
    @Query() createdAt?: Date,
    @Query() isApproved?: ApprovalStatus,
    @Query() category?: string
  ) {
    return {} as ProductsResponse;
  }

  /**
   * @summary Update product active status
   */
  @Security("Bearer")
  @Patch("{productId}")
  public async updateProductStatus(@Path() productId: string, @Body() requestBody: { status: boolean }) {
    return {} as ProductResponse;
  }

  /**
   * @summary Update product featured status
   */
  @Security("Bearer")
  @Patch("featured/{productId}")
  public async updateProductFeaturedStatus(@Path() productId: string, @Body() requestBody: { isFeatured: boolean }) {
    return {} as ProductResponse;
  }

  /**
   * @summary Update product approval status
   */
  @Security("Bearer")
  @Patch("approve/{productId}")
  public async updateProductApprovalStatus(@Path() productId: string, @Body() requestBody: { status: ApprovalStatus }) {
    return {} as ProductResponse;
  }

  /**
   * @summary get product by id and admin token
   */
  @Security("Bearer")
  @Get("{pIdSlug}/by-admin")
  public async getProductByAdmin(@Path() pIdSlug: string) {
    return {} as ProductResponse;
  }

  /**
   * @summary get product by id and vendor token
   */
  @Security("Bearer")
  @Get("{pIdSlug}/by-vendor")
  public async getProductByVendor(@Path() pIdSlug: string) {
    return {} as ProductResponse;
  }

  /**
   * @summary get collections by product id
   */
  @Get("{pIdSlug}/collections")
  public async getCollectionsByProductId(@Path() pIdSlug: string, @Query() page?: string, @Query() pageSize?: string) {
    return {} as CollectionsResponse;
  }

  /**
   * @summary fetch home page products by type
   */
  @Get("home-page/{type}")
  public async getProductsByType(@Path() type: string, @Query() page?: string, @Query() pageSize?: string) {
    return {} as ProductsResponse;
  }

  /**
   * @summary fetch single product details
   */
  @Get("{pId}")
  public async getSingleProduct(@Path() pId: string) {
    return {} as ProductResponse;
  }

  /**
   * @summary fetch products
   */
  @Get("")
  public async getProducts(
    @Query() page?: number,
    @Query() pageSize?: number,
    @Query() textSearch?: string,
    @Query() createdAt?: Date,
    @Query() isApproved?: ApprovalStatus,
    @Query() category?: string
  ) {
    return {} as ProductsResponse;
  }
}
