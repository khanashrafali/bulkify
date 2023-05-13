import { Body, Controller, Delete, Get, Patch, Path, Post, Put, Query, Route, Security, Tags } from "tsoa";
import { CategoriesResponse, CategoryResponse } from "../models";

@Tags("Category")
@Route("categories")
export class CategoryController extends Controller {
  /**
   * @summary fetch categories
   */
  @Get("")
  public async getMainCategories(
    @Query() page?: string,
    @Query() pageSize?: string,
    @Query() status?: boolean,
    @Query() createdAt?: Date
  ) {
    return {} as CategoriesResponse;
  }

  /**
   * @summary fetch single category details
   */
  @Get("/{categoryId}")
  public async getMainCategoryById(@Path() categoryId: string) {
    return {} as CategoryResponse;
  }

  /**
   * @summary fetch categories by admin
   */
  @Security("Bearer")
  @Get("by-admin")
  public async getMainCategoriesByAdmin(
    @Query() page?: string,
    @Query() pageSize?: string,
    @Query() status?: boolean,
    @Query() createdAt?: Date
  ) {
    return {} as CategoriesResponse;
  }

  /**
   * @summary Create new category
   */
  @Security("Bearer")
  @Post("")
  public async createMainCategory(@Body() requestBody: { name: string; status: boolean; image: string }) {
    return {} as CategoryResponse;
  }

  /**
   * @summary Update existing category
   */
  @Security("Bearer")
  @Put("{categoryId}")
  async updateMainCategory(
    @Path() categoryId: string,
    @Body() requestBody: { name: string; status: boolean; image: string }
  ) {
    return {} as CategoryResponse;
  }

  /**
   * @summary Update existing category active status
   */
  @Security("Bearer")
  @Patch("{categoryId}")
  public async updateMainCategoryStatus(@Path() categoryId: string, @Body() requestBody: { status: boolean }) {
    return {} as CategoryResponse;
  }

  /**
   * @summary Delete existing category
   */
  @Security("Bearer")
  @Delete("{categoryId}")
  public async deleteMainCategoryStatus(@Path() categoryId: string) {
    return {} as CategoryResponse;
  }

  /**
   * @summary create sub category by admin
   */
  @Security("Bearer")
  @Post("sub-categories/{mainCategoryId}")
  public async createSubCategory(
    @Path() mainCategoryId: string,
    @Body()
    requestBody: {
      name: string;
      status: boolean;
      collectionIds: string[];
      image: string;
    }
  ) {
    return {} as CategoryResponse;
  }

  /**
   * @summary update sub category by admin
   */
  @Security("Bearer")
  @Put("sub-categories/{mainCategoryId}")
  public async updateSubCategory(
    @Path() mainCategoryId: string,
    @Body()
    requestBody: {
      subCategoryId: string;
      name: string;
      status: boolean;
      collectionIds: string[];
      image: string;
    }
  ) {
    return {} as CategoryResponse;
  }

  /**
   * @summary fetch sub categories by admin
   */
  @Security("Bearer")
  @Get("sub-categories/list/by-admin/{mainCategoryId}")
  public async getSubCategoriesByAdmin(
    @Path() mainCategoryId: string,
    @Query() page?: string,
    @Query() pageSize?: string
  ) {
    return {} as CategoriesResponse;
  }

  /**
   * @summary delete sub category
   */
  @Security("Bearer")
  @Delete("sub-categories/{subCategoryId}}")
  public async deleteSubCategory(@Path() subCategoryId: string) {
    return {} as CategoryResponse;
  }

  /**
   * @summary fetch sub categories
   */
  @Get("sub-categories/list/{mainCategoryId}")
  public async getSubCategories(@Path() mainCategoryId: string, @Query() page?: string, @Query() pageSize?: string) {
    return {} as CategoriesResponse;
  }

  /**
   * @summary fetch sub category
   */
  @Get("sub-categories/{subCategoryId}}")
  public async getSubCategory(@Path() subCategoryId: string) {
    return {} as CategoryResponse;
  }
}
