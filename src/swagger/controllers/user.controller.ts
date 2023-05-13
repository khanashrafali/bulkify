import { Body, Controller, Get, Patch, Put, Query, Route, Security, Tags } from "tsoa";
import { DashboardResponse, TSOAUser } from "../models";

@Tags("Users")
@Route("users")
export class UserController extends Controller {
  /**
   * @summary get users
   */
  @Security("Bearer")
  @Get("")
  public async getUsers(
    @Query() page?: number,
    @Query() pageSize?: number,
    @Query() textSearch?: string,
    @Query() createdAt?: Date
  ) {
    return {} as TSOAUser[];
  }

  /**
   * @summary get app home page info
   */
  @Security("Bearer")
  @Get("app-home")
  public async getAppHome() {
    return {} as TSOAUser[];
  }

  /**
   * @summary update user Status
   */
  @Security("Bearer")
  @Patch("")
  public async updateUserStatus(@Body() requestBody: { status: boolean }) {
    return {} as TSOAUser[];
  }

  /**
   * @summary update user Status
   */
  @Security("Bearer")
  @Put("update/me")
  public async updateUserProfile(@Body() requestBody: { email: string; name: string; mobileNumber: string }) {
    return {} as TSOAUser[];
  }

  /**
   * @summary get admin dashboard
   */
  @Security("Bearer")
  @Get("dashboard")
  public async getDashboard() {
    return {} as DashboardResponse;
  }
}
