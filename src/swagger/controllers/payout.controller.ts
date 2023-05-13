import { Body, Controller, Get, Path, Post, Query, Route, Security, Tags } from "tsoa";
import { PayoutResponse, PayoutsResponse, TSOATransaction } from "../models";

@Tags("Payouts")
@Route("Payouts")
@Security("Bearer")
export class TransactionController extends Controller {
  /**
   * @summary get payout by id
   */
  @Get("{payoutId}")
  public async getPayout(@Path() payoutId: string) {
    return {} as PayoutResponse;
  }

  /**
   * @summary get payouts
   */
  @Get("")
  public async getPayouts(@Query() page?: number, @Query() pageSize?: number, @Query() textSearch?: string) {
    return {} as PayoutsResponse;
  }

  /**
   * @summary create payout
   */
  @Post("")
  public async createPayout(
    @Body()
    requestBody: {
      payouts: {
        order: string;
        msg: string;
        amount: number;
      }[];
    }
  ) {
    return {} as PayoutResponse;
  }
}
