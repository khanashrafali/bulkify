import { Body, Controller, Delete, FormField, Get, Patch, Path, Post, Put, Query, Route, Security, Tags, UploadedFile } from "tsoa";
import { ApprovalStatus } from "../../utils/interfaces";
import { ApiResponse, VendorResponse, VendorsResponse } from "../models";

@Tags("Vendors")
@Route("vendors")
export class VendorController extends Controller {
  /**
   * @summary Create new Vendor
   */
  @Security("Bearer")
  @Post("")
  public async createVendor(
    @Body()
    requestBody: {
      name: string;
      email: string;
      mobileNumber: string;
      gstNumber: string;
      panNumber: string;
      businessType: string;
      address: string;
    }
  ) {
    return {} as VendorResponse;
  }

  /**
   * @summary Create new Vendor
   */
  @Security("Bearer")
  @Post("became-a-vendor")
  public async becameAVendor(
    @Body()
    requestBody: {
      name: string;
      email: string;
      mobileNumber: string;
      gstNumber: string;
      panNumber: string;
      businessType: string;
      address: string;
    }
  ) {
    return {} as VendorResponse;
  }

  /**
   * @summary Complete vendor profile
   */
  // @Security("Bearer")
  // @Post("complete-profile")
  // async completeVendorProfile(
  //   @FormField() businessName: string,
  //   @UploadedFile() profileImage: Express.Multer.File,
  //   @FormField() businessEmail: string,
  //   @FormField() mobileNumber: string,
  //   @FormField() gstNumber: string,
  //   @FormField() panNumber: string,
  //   @UploadedFile() addressProof: Express.Multer.File[],
  //   @FormField() status: string,
  //   @FormField() pickupLocation: string
  // ) {
  //   return {} as VendorResponse;
  // }

  /**
   * @summary Update Vendor info
   */
  @Security("Bearer")
  @Put("{vendorId}")
  public async updateVendor(
    @Path() vendorId: string,
    @Body()
    requestBody: {
      name: string;
      email: string;
      mobileNumber: string;
      gstNumber: string;
      panNumber: string;
      businessType: string;
      address: string;
    }
  ) {
    return {} as VendorResponse;
  }

  /**
   * @summary Update existing vendor active status
   */
  @Security("Bearer")
  @Patch("{vendorId}")
  public async updateVendorStatus(@Path() vendorId: string, @Body() requestBody: { status: boolean }) {
    return {} as VendorResponse;
  }

  /**
   * @summary Update existing vendor approval status
   */
  @Security("Bearer")
  @Patch("approve/{vendorId}")
  public async updateVendorApprovalStatus(@Path() vendorId: string, @Body() requestBody: { status: boolean }) {
    return {} as VendorResponse;
  }

  /**
   * @summary Delete existing vendor
   */
  @Security("Bearer")
  @Delete("{vendorId}")
  public async deleteVendor(@Path() vendorId: string) {
    return {} as VendorResponse;
  }

  /**
   * @summary fetch vednors by admin
   */
  @Security("Bearer")
  @Get("by-admin")
  public async getVendorsByAdmin(
    @Query() page?: number,
    @Query() pageSize?: number,
    @Query() textSearch?: string,
    @Query() createdAt?: Date,
    @Query() isVendorProfileComplete?: boolean,
    @Query() status?: boolean,
    @Query() isApproved?: ApprovalStatus
  ) {
    return {} as VendorsResponse;
  }

  /**
   * @summary Delete vendor old image
   */
  @Security("Bearer")
  @Delete("images/{vendorId}")
  public async deleteVendorImage(@Path() vendorId: string) {
    return {} as ApiResponse;
  }

  /**
   * @summary fetch vednors
   */
  @Get("")
  public async getVendors(
    @Query() page?: number,
    @Query() pageSize?: number,
    @Query() textSearch?: string,
    @Query() createdAt?: Date,
    @Query() isVendorProfileComplete?: boolean,
    @Query() status?: boolean,
    @Query() isApproved?: ApprovalStatus
  ) {
    return {} as VendorsResponse;
  }

  /**
   * @summary fetch single vendor details
   */
  @Get("/{vendorId}")
  public async getSingleVendor(@Path() vendorId: string) {
    return {} as VendorResponse;
  }
}
