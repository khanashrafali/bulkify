import bcrypt from "bcryptjs";
import validator from "validator";
import { Response } from "express";
import randomStr from "randomstring";
import { shiprocketService } from ".";
import { userModel, vendorModel } from "../models";
import { CONSTANT, emailHandler, fileHandler, helper } from "../utils";
import { IRequest } from "../utils/interfaces";
import moment from "moment";

helper.loadEnvFile();

/**
 * create vender handler
 */
const addVendor = async (req: IRequest, body: any, res: Response) => {
  try {
    const user = await userModel.findOne({ mobileNumber: body.mobileNumber });
    if (user) throw helper.buildError("This mobile number or email already in use", 400);

    const randomPassword = randomStr.generate({ length: 8 });
    const password = await bcrypt.hash(randomPassword, 12);
    let data = {
      ...body,
      isActive: true,
      isMobileVerified: true,
      isEmailVerified: true,
      isProfileComplete: true,
      password,
    };
    await vendorModel.create(data);
    helper.buildResponse(res, "Vendor registered successfully");
    // await emailHandler.sentVendorInvitationMail(body.businessEmail, body.name);
    await emailHandler.sentVendorInvitationMail(body.name, body.email, randomPassword);
  } catch (error) {
    throw error;
  }
};

/**
 * update vender handler
 */
const updateVendor = async (vendorId: string, body: any) => {
  try {
    const vendor = await vendorModel.findOne({ _id: vendorId });
    if (!vendor) throw helper.buildError("No vendor found with this id", 404);
    await vendor.set(body).save();
  } catch (error) {
    throw error;
  }
};

/**
 * get vender handler
 */
const getVendor = async (vendorId: string) => {
  try {
    let vendor = await vendorModel.findOne({ _id: vendorId }).lean();
    if (!vendor) throw helper.buildError("No vendor found with this id", 404);
    return vendor;
  } catch (error) {
    throw error;
  }
};

/**
 * delete vender handler
 */
const deleteVendor = async (vendorId: string) => {
  try {
    let vendor: any = await vendorModel.findOne({ _id: vendorId });
    if (!vendor) throw helper.buildError("No vendor found with this id", 404);
    await vendor.delete();
  } catch (error) {
    throw error;
  }
};

/**
 * get vender list handler
 */
const getVendors = async (queryParams: any) => {
  try {
    let conditions: any = { isActive: true };
    let { textSearch, isProfileComplete, isActive, createdAt, isApproved } = queryParams;
    const pageInfo = helper.checkPagination(queryParams);

    if (textSearch) {
      conditions["$or"] = [
        { name: { $regex: helper.regxEscape(textSearch), $options: "i" } },
        { email: { $regex: helper.regxEscape(textSearch), $options: "i" } },
        { mobileNumber: { $regex: helper.regxEscape(textSearch), $options: "i" } },
        { businessEmail: { $regex: helper.regxEscape(textSearch), $options: "i" } },
        { businessName: { $regex: helper.regxEscape(textSearch), $options: "i" } },
      ];
    }

    if (isProfileComplete) conditions.isProfileComplete = isProfileComplete;
    if (isActive) conditions.isActive = isActive;
    if (createdAt) conditions.date = new Date(createdAt);
    if (isApproved) conditions.isApproved = isApproved;

    let docs = [];
    let mongoQuery = vendorModel.find(conditions).sort({ createdAt: -1 });
    const count = await vendorModel.countDocuments(conditions);

    if (pageInfo) docs = await mongoQuery.skip(pageInfo.skip).limit(pageInfo.pageSize);
    else docs = await mongoQuery;

    return helper.makePaginatedData(docs, count, pageInfo);
  } catch (error) {
    throw error;
  }
};

/**
 * get vender list by admin handler
 */
const getVendorsByAdmin = async (queryParams: any) => {
  try {
    let conditions: any = {};
    let { textSearch, isProfileComplete, isActive, createdAt, isApproved } = queryParams;
    const pageInfo = helper.checkPagination(queryParams);

    if (textSearch) {
      conditions["$or"] = [
        { name: { $regex: helper.regxEscape(textSearch), $options: "i" } },
        { email: { $regex: helper.regxEscape(textSearch), $options: "i" } },
        { mobileNumber: { $regex: helper.regxEscape(textSearch), $options: "i" } },
        { businessEmail: { $regex: helper.regxEscape(textSearch), $options: "i" } },
        { businessName: { $regex: helper.regxEscape(textSearch), $options: "i" } },
      ];
    }
    if (isProfileComplete) conditions.isProfileComplete = isProfileComplete;
    if (isActive) conditions.isActive = isActive;
    if (createdAt) conditions.date = new Date(createdAt);
    if (isApproved) conditions.isApproved = isApproved;

    let docs = [];
    let mongoQuery = vendorModel.find(conditions).sort({ createdAt: -1 });
    const count = await vendorModel.countDocuments(conditions);

    if (pageInfo) docs = await mongoQuery.skip(pageInfo.skip).limit(pageInfo.pageSize);
    else docs = await mongoQuery;

    return helper.makePaginatedData(docs, count, pageInfo);
  } catch (error) {
    throw error;
  }
};

/**
 * update vender status handler
 */
const updateVendorStatus = async (vendorId: string, isActive: boolean) => {
  try {
    let vendor: any = await vendorModel.findOne({ _id: vendorId });
    if (!vendor) throw helper.buildError("No vendor found with this id", 404);
    await vendor.set({ isActive }).save();
  } catch (error) {
    throw error;
  }
};

/**
 * update vender status handler
 */
const updateVendorApproval = async (vendorId: string, isApproved: string) => {
  try {
    let vendor: any = await vendorModel.findOne({ _id: vendorId });
    if (!vendor) throw helper.buildError("No vendor found with this id", 404);
    await vendor.set({ isApproved }).save();
  } catch (error) {
    throw error;
  }
};

/**
 * complete vender profile handler
 */
const completeVendorProfile = async (req: IRequest, fileObj: any, body: any, res: Response) => {
  try {
    // let pickupLocation = await shiprocketService.getPickupAddress(body.pickupLocation);

    let avatar = fileObj.avatar[0]?.Location;
    let images = fileObj.images.map((f: any) => f.Location);
    let video = fileObj.video[0]?.Location;

    await req.user
      .set({
        ...body,
        avatar,
        images,
        video,
        isProfileComplete: true,
        isActive: true,
        bankDetails: {
          accountHolderName: body.accountHolderName,
          ifscCode: body.ifscCode,
          bankName: body.bankName,
          accountNumber: body.accountNumber,
        },
      })
      .save();
    helper.buildResponse(res, "Profile completed");
    // await emailHandler.sentVendorInvitationMail(body.businessEmail, body.businessName);
  } catch (error) {
    throw error;
  }
};

/**
 * became A Vendor handler
 */
const becameAVendor = async (req: IRequest, fileObj: any, body: any, res: Response) => {
  try {
    if (!fileObj.avatar?.length) {
      throw helper.buildError("avatar is required", 400);
    }

    if (!fileObj.images?.length) {
      throw helper.buildError("images is required", 400);
    }

    if (!fileObj.video?.length) {
      throw helper.buildError("video is required", 400);
    }

    let avatar = fileObj.avatar[0]?.Location;
    let images = fileObj.images.map((f: any) => f.Location);
    let video = fileObj.video[0]?.Location;

    const randomPassword = randomStr.generate({ length: 8 });
    const password = await bcrypt.hash(randomPassword, 12);

    // const varificationToken = helper.getHash();
    // const expirationTime = moment(moment()).add(5, "minutes");

    await vendorModel.create({
      ...body,
      avatar,
      images,
      video,
      isProfileComplete: true,
      isActive: false,
      password,
      bankDetails: {
        accountHolderName: body.accountHolderName,
        ifscCode: body.ifscCode,
        bankName: body.bankName,
        accountNumber: body.accountNumber,
      },
      // varificationToken,
      // expirationTime,
    });
    helper.buildResponse(res, "Your profile is under review, notify you when it's approved.");
    await emailHandler.sentVendorInvitationMail(body.name, body.email, randomPassword);
  } catch (error) {
    throw error;
  }
};

const generateNewPassword = async (vendorId: any, res: Response) => {
  try {
    let vendor = await vendorModel.findOne({ _id: vendorId });
    if (!vendor) throw helper.buildError("no vendor found with this id", 404);
    const randomPassword = randomStr.generate({ length: 8 });
    const password = await bcrypt.hash(randomPassword, 12);
    let vendorObj: any = vendor.toJSON();
    await vendor.set({ password }).save();
    helper.buildResponse(res, "New Password Generate Successfully.");
    await emailHandler.resetPasswordByAdminVendorTamplate(vendorObj.name, vendorObj.email, randomPassword);
  } catch (error) {
    throw error;
  }
};

export default {
  addVendor,
  updateVendor,
  getVendor,
  getVendors,
  deleteVendor,
  updateVendorStatus,
  getVendorsByAdmin,
  completeVendorProfile,
  updateVendorApproval,
  becameAVendor,
  generateNewPassword,
};
