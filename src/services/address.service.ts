import { addressModel, deleveryAddressModel } from "../models";
import { helper } from "../utils";
import { IRequest } from "../utils/interfaces";

helper.loadEnvFile();

/**
 * save user's billing/shipping addresses
 */
const saveAddress = async (req: IRequest, data: any) => {
  try {
    // let dAddress = await deleveryAddressModel.findOne({ pincode: data.pinCode });
    // if (!dAddress) throw helper.buildError("Delivery not available in your area", 400);

    if (data.isDefault) {
      await addressModel.updateMany({ user: req.user._id }, { $set: { isDefault: false } });
    }
    let oldAddresses = await getAddresses(req);
    if (!oldAddresses?.length) data.isDefault = true;
    return await addressModel.create({ ...data, user: req.user._id });
  } catch (error) {
    throw error;
  }
};

/**
 * fetch user's billing/shipping address
 */
const getAddress = async (req: IRequest, addressId: string) => {
  try {
    const oldAddress = await addressModel.findOne({ _id: addressId, user: req.user._id });
    if (!oldAddress) throw helper.buildError("No address found with this id", 404);
    return oldAddress;
  } catch (error) {
    throw error;
  }
};

/**
 * fetch user's billing/shipping addresses
 */
const getAddresses = async (req: IRequest) => {
  try {
    return await addressModel
      .find({ isDefault: { $exists: true }, user: req.user._id })
      .sort({ isDefault: -1 })
      .lean();
  } catch (error) {
    throw error;
  }
};

/**
 * update user's billing/shipping addresses
 */
const updateAddress = async (req: IRequest, addressId: string, data: any) => {
  try {
    // let dAddress = await deleveryAddressModel.findOne({ pincode: data.pinCode });
    // if (!dAddress) throw helper.buildError("Delivery not available in your area", 400);

    const oldAddress = await addressModel.findOne({ _id: addressId, user: req.user._id });
    if (!oldAddress) throw helper.buildError("No address found with this id", 404);
    let addressObj: any = oldAddress.toJSON();

    if (!data.isDefault && addressObj.isDefault) {
      throw helper.buildError("can't undefault your default address", 404);
    }

    let addressCount = await addressModel.countDocuments({ user: req.user._id });
    if (addressCount == 1) data.isDefault = true;

    if (data.isDefault) {
      await addressModel.updateMany({ _id: { $ne: addressId } }, { $set: { isDefault: false } });
    }

    await oldAddress.set(data).save();
  } catch (error) {
    throw error;
  }
};

/**
 * delete user's billing/shipping address
 */
const deleteAddress = async (req: IRequest, addressId: string) => {
  try {
    const oldAddress = await addressModel.findOne({ _id: addressId, user: req.user._id });
    if (!oldAddress) throw helper.buildError("No address found with this id", 404);
    return await oldAddress.remove();
  } catch (error) {
    throw error;
  }
};

/**
 * make default address
 */
const makeDefaultAddress = async (req: IRequest, addressId: string) => {
  try {
    let address = await addressModel.findOne({ _id: addressId, user: req.user });
    if (!address) throw helper.buildError("No address found with this id", 404);
    await addressModel.updateMany({ user: req.user }, { $set: { isDefault: false } });
    await address.set({ isDefault: true }).save();
  } catch (error) {
    throw error;
  }
};

export default {
  saveAddress,
  getAddress,
  getAddresses,
  updateAddress,
  deleteAddress,
  makeDefaultAddress,
};
