import { Body, Controller, Delete, Get, Path, Post, Put, Route, Security, Tags } from "tsoa";
import { AddressesResponse, AddressResponse } from "../models";

@Tags("Address")
@Route("address")
@Security("Bearer")
export class AddressController extends Controller {
  /**
   * @summary Add Address
   */
  @Post("")
  public async addAddress(
    @Body()
    requestBody: {
      mobileNumber: string;
      firstName: string;
      lastName: string;
      city: string;
      pinCode: string;
      address: string;
      isDefault: boolean;
    }
  ) {
    return {} as AddressResponse;
  }

  /**
   * @summary Update Address
   */
  @Put("{addressId}")
  public async updateAddress(
    @Path() addressId: string,
    @Body()
    requestBody: {
      mobileNumber: string;
      firstName: string;
      lastName: string;
      city: string;
      pinCode: string;
      address: string;
      isDefault: boolean;
    }
  ) {
    return {} as AddressResponse;
  }

  /**
   * @summary fetch Addresses
   */
  @Get("")
  public async getAddresses() {
    return {} as AddressesResponse;
  }

  /**
   * @summary fetch Address By id
   */
  @Get("{addressId}")
  public async getAddress(@Path() addressId: string) {
    return {} as AddressResponse;
  }

  /**
   * @summary Delete Address
   */
  @Delete("{addressId}")
  public async deleteAddress(@Path() addressId: string) {
    return {} as AddressResponse;
  }

  /**
   * @summary make default Address
   */
  @Put("default/{addressId}")
  public async makeDefaultAddress(@Path() addressId: string) {
    return {} as AddressResponse;
  }
}
