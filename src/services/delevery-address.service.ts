import { addressModel, deleveryAddressModel } from "../models";
import { helper } from "../utils";

helper.loadEnvFile();

const addDeleveryAddress = async (data: any) => {
  try {
    return await deleveryAddressModel.create(data);
  } catch (error) {
    throw error;
  }
};

const updateDeleveryAddress = async (addressId: string, data: any) => {
  try {
    let address = await deleveryAddressModel.findOne({ _id: addressId });
    if (!address) throw helper.buildError("no address found with this id", 404);
    await address.set(data).save();
  } catch (error) {
    throw error;
  }
};

const getDeleveryAddress = async (addressId: string) => {
  try {
    let address = await deleveryAddressModel.findOne({ _id: addressId });
    if (!address) throw helper.buildError("no address found with this id", 404);
    return address;
  } catch (error) {
    throw error;
  }
};

const getDeleveryAddresses = async (queryParams: any) => {
  try {
    let conditions: any = {};
    const pageInfo = helper.checkPagination(queryParams);

    if ("pincode" in queryParams) conditions.pincode = queryParams.pincode;

    let mongoQuery = deleveryAddressModel.find(conditions);
    const count = await deleveryAddressModel.countDocuments(conditions);
    let docs: any[] = [];

    if (pageInfo) docs = await mongoQuery.skip(pageInfo.skip).limit(pageInfo.pageSize);
    else docs = await mongoQuery;

    return helper.makePaginatedData(docs, count, pageInfo);
  } catch (error) {
    throw error;
  }
};

const deleteDeleveryAddress = async (addressId: string) => {
  try {
    let address = await deleveryAddressModel.findOne({ _id: addressId });
    if (!address) throw helper.buildError("no address found with this id", 404);
    await address.remove();
  } catch (error) {
    throw error;
  }
};

const uploadAddress = async (locations: any[]) => {
  try {
    for await (let p of locations) {
      let address = await deleveryAddressModel.findOne({ pincode: p.pincode });
      if (!address) await deleveryAddressModel.create({ pincode: p.pincode });
    }
  } catch (error) {
    throw error;
  }
};

export default {
  addDeleveryAddress,
  updateDeleveryAddress,
  getDeleveryAddress,
  getDeleveryAddresses,
  deleteDeleveryAddress,
  uploadAddress,
};
