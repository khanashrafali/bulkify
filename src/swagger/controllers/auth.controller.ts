import { param } from "express-validator";
import { Body, Controller, Get, Path, Post, Put, Query, Route, Security, Tags, UploadedFiles } from "tsoa";
import { UserRole } from "../../utils/interfaces";
import { ApiResponse } from "../models";

@Tags("Authantication")
@Route("auth")
export class AuthController extends Controller {
  /**
   *@summary  get my account details
   */
  @Security("Bearer")
  @Get("me")
  public async getMyInfo() {
    return {} as ApiResponse;
  }

  /**
   *@summary  users login api
   */
  @Post("app-login")
  public async loginUser(@Body() requestBody: { emailOrMobile: string }) {
    return {} as ApiResponse;
  }

  /**
   *@summary  vendor login api
   */
  @Post("vendor-login")
  public async loginVendor(@Body() requestBody: { email: string; password: string }) {
    return {} as ApiResponse;
  }

  /**
   *@summary  admin login api
   */
  @Post("admin-login")
  public async loginAdmin(@Body() requestBody: { email: string; password: string }) {
    return {} as ApiResponse;
  }

  /**
   *@summary  admin signup api
   */
  @Post("admin-signup")
  public async signupAdmin(@Body() requestBody: { email: string; password: string; confirmPassword: string }) {
    return {} as ApiResponse;
  }

  /**
   *@summary  vendor signup api
   */
  @Post("vendor-signup")
  public async signupVendor(@Body() requestBody: { email: string; password: string; confirmPassword: string }) {
    return {} as ApiResponse;
  }

  /**
   *@summary  verify otp
   */
  @Post("verify-otp")
  public async verifyOtp(@Body() requestBody: { emailOrMobile: string; otp: string }) {
    return {} as ApiResponse;
  }

  /**
   *@summary  check token is valid or not
   */
  @Get("token/validate")
  public async validateToken(@Query() token: string) {
    return {} as ApiResponse;
  }

  /**
   *@summary  users signup api
   */
  @Post("signup")
  public async signupUser(@Body() requestBody: { name: string; mobileNumber: string; role: UserRole }) {
    return {} as ApiResponse;
  }

  /**
   *@summary  resend otp
   */
  @Post("resend-otp")
  public async resendOtp(@Body() requestBody: { emailOrMobile: string }) {
    return {} as ApiResponse;
  }

  /**
   *@summary  resend vendor email
   */
  @Post("resend-vendor-email")
  public async resendVendorEmail(@Body() requestBody: { email: string }) {
    return {} as ApiResponse;
  }

  /**
   *@summary  resend admin email
   */
  @Post("resend-admin-email")
  public async resendAdminEmail(@Body() requestBody: { email: string }) {
    return {} as ApiResponse;
  }

  /**
   *@summary  verify vendor email
   */
  @Get("verify-vendor-email/{token}")
  public async verifyVendorEmail(@Path() token: string) {
    return {} as ApiResponse;
  }

  /**
   *@summary  verify admin email
   */
  @Get("verify-admin-email/{token}")
  public async verifyAdminEmail(@Path() token: string) {
    return {} as ApiResponse;
  }

  /**
   *@summary change admin password
   */
  @Post("admin-change-password")
  public async changeAdminPassword(@Body() requestBody: { oldPassword: string; newPassword: string; confirmPassword: string }) {
    return {} as ApiResponse;
  }

  /**
   *@summary change vendor password
   */
  @Post("vendor-change-password")
  public async changeVendorPassword(@Body() requestBody: { oldPassword: string; newPassword: string; confirmPassword: string }) {
    return {} as ApiResponse;
  }

  /**
   *@summary admin forgot password
   */
  @Post("admin-forgot-password-mail")
  public async forgetAdminPassword(@Body() requestBody: { email: string }) {
    return {} as ApiResponse;
  }

  /**
   *@summary admin forgot password
   */
  @Post("vendor-forgot-password-mail")
  public async forgetVendorPassword(@Body() requestBody: { email: string }) {
    return {} as ApiResponse;
  }

  /**
   *@summary vendor reset password
   */
  @Put("vendor-reset-password/{token}")
  public async setVendorPassword(@Path() token: string, @Body() requestBody: { newPassword: string; confirmPassword: string }) {
    return {} as ApiResponse;
  }

  /**
   *@summary admin reset password
   */
  @Put("admin-reset-password/{token}")
  public async setAdminPassword(@Path() token: string, @Body() requestBody: { newPassword: string; confirmPassword: string }) {
    return {} as ApiResponse;
  }

  /**
   *@summary  uplaod files api
   */
  @Security("Bearer")
  @Post("upload-files")
  public async uploadFiles(@UploadedFiles() images: Express.Multer.File) {
    return {} as ApiResponse;
  }
}
