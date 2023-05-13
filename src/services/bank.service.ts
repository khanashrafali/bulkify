import { bankModel } from "../models";
import { helper } from "../utils";
import { IRequest } from "../utils/interfaces";

helper.loadEnvFile();

/**
 * save user's billing/shipping banks
 */
const addBank = async (req: IRequest, data: any) => {
  try {
    if (data.isDefault) await bankModel.updateMany({ user: req.user._id }, { $set: { isDefault: false } });
    return await bankModel.create({ ...data, user: req.user._id });
  } catch (error) {
    throw error;
  }
};

/**
 * fetch user's billing/shipping bank
 */
const getBank = async (req: IRequest, bankId: string) => {
  try {
    const oldAddress = await bankModel.findOne({ _id: bankId, user: req.user._id });
    if (!oldAddress) throw helper.buildError("No bank found with this id", 404);
    return oldAddress;
  } catch (error) {
    throw error;
  }
};

/**
 * fetch user's billing/shipping banks
 */
const getBanks = async (req: IRequest) => {
  try {
    return await bankModel
      .find({ isDefault: { $exists: true }, user: req.user._id })
      .sort({ isDefault: -1 })
      .lean();
  } catch (error) {
    throw error;
  }
};

/**
 * update user's billing/shipping banks
 */
const updateBank = async (req: IRequest, bankId: string, data: any) => {
  try {
    if (data.isDefault) await bankModel.updateMany({ _id: { $ne: bankId } }, { $set: { isDefault: false } });
    const oldAddress = await bankModel.findOne({ _id: bankId, user: req.user._id });
    if (!oldAddress) throw helper.buildError("No bank found with this id", 404);
    await oldAddress.set(data).save();
  } catch (error) {
    throw error;
  }
};

/**
 * delete user's billing/shipping bank
 */
const deleteBank = async (req: IRequest, bankId: string) => {
  try {
    const oldAddress = await bankModel.findOne({ _id: bankId, user: req.user._id });
    if (!oldAddress) throw helper.buildError("No bank found with this id", 404);
    return await oldAddress.remove();
  } catch (error) {
    throw error;
  }
};

/**
 * make default bank
 */
const makeDefaultBank = async (req: IRequest, bankId: string) => {
  try {
    let bank = await bankModel.findOne({ _id: bankId, user: req.user });
    if (!bank) throw helper.buildError("No bank found with this id", 404);
    await bankModel.updateMany({ user: req.user }, { $set: { isDefault: false } });
    await bank.set({ isDefault: true }).save();
  } catch (error) {
    throw error;
  }
};

export default {
  addBank,
  getBank,
  getBanks,
  updateBank,
  deleteBank,
  makeDefaultBank,
};
