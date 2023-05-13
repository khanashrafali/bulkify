import { Body, Controller, Delete, Get, Path, Post, Put, Route, Security, Tags } from "tsoa";
import { BanksResponse, BankResponse } from "../models";

@Tags("Bank")
@Route("banks")
@Security("Bearer")
export class BankController extends Controller {
  /**
   * @summary Add Banks
   */
  @Post("")
  public async addBanks(
    @Body()
    requestBody: {
      accountNumber: string;
      holderName: string;
      ifscCode: string;
      isDefault: boolean;
    }
  ) {
    return {} as BanksResponse;
  }

  /**
   * @summary Update Banks
   */
  @Put("{banksId}")
  public async updateBanks(
    @Path() banksId: string,
    @Body()
    requestBody: {
      accountNumber: string;
      holderName: string;
      ifscCode: string;
      isDefault: boolean;
    }
  ) {
    return {} as BanksResponse;
  }

  /**
   * @summary fetch Bankses
   */
  @Get("")
  public async getBankses() {
    return {} as BanksResponse;
  }

  /**
   * @summary fetch Banks By id
   */
  @Get("{banksId}")
  public async getBanks(@Path() banksId: string) {
    return {} as BankResponse;
  }

  /**
   * @summary Delete Banks
   */
  @Delete("{banksId}")
  public async deleteBanks(@Path() banksId: string) {
    return {} as BankResponse;
  }

  /**
   * @summary make default Banks
   */
  @Put("default/{banksId}")
  public async makeDefaultBanks(@Path() banksId: string) {
    return {} as BankResponse;
  }
}
