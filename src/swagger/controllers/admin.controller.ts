import { Body, Controller, Get, Patch, Path, Post, Query, Route, Security, Tags } from "tsoa";
import { ApiResponse, TSOAAdmin } from "../models";

@Tags("Admins")
@Route("admins")
export class AdminController extends Controller {
  /**
   * @summary get admins
   */
  @Security("Bearer")
  @Get("")
  public async getAdmins(@Query() page?: string, @Query() pageSize?: string) {
    return {} as TSOAAdmin[];
  }

  /**
   * @summary add Admin
   */
  @Security("Bearer")
  @Post("")
  public async loginUser(@Body() requestBody: { name: string; email: string }) {
    return {} as ApiResponse;
  }

  /**
   * @summary update admin status
   */
  @Security("Bearer")
  @Patch("isActive/{adminId}")
  public async updateAdminStatus(@Path() adminId: string, @Body() requestBody: { status: boolean }) {
    return {} as TSOAAdmin;
  }
}
