import bcrypt from "bcryptjs";
import { Response } from "express";
import randomStr from "randomstring";
import { adminModel, configModel, userModel } from "../models";
import { emailHandler, helper } from "../utils";
import { AdminModule, ApprovalStatus, UserRole } from "../utils/interfaces";

helper.loadEnvFile();

/**
 * get Admin Users
 */
const getAdmins = async (queryParams: any) => {
  try {
    let conditions: any = { role: UserRole.ADMIN };
    const pageInfo = helper.checkPagination(queryParams);

    if ("textSearch" in queryParams) {
      let regex = { $regex: helper.regxEscape(queryParams.textSearch), $options: "i" };
      conditions["$or"] = [{ name: regex }, { email: regex }];
    }

    if ("status" in queryParams) conditions.isActive = queryParams.status;
    if ("createdAt" in queryParams) conditions.date = queryParams.createdAt;

    let query = adminModel
      .find(conditions)
      .select("name email isActive date adminRole createdAt")
      .populate("adminRole")
      .sort({ createdAt: -1 })
      .lean();

    let count = await userModel.countDocuments(conditions);
    let docs: any[] = [];

    if (pageInfo) docs = await query.skip(pageInfo.skip).limit(pageInfo.pageSize);
    else docs = await query;

    return helper.makePaginatedData(docs, count, pageInfo);
  } catch (error) {
    throw error;
  }
};

/**
 * Create super admin
 */
const createSuperAdmin = async () => {
  try {
    let superAdmin = await adminModel.findOne({ role: UserRole.SUPER_ADMIN });
    if (superAdmin) throw helper.buildError("Super Admin Already exists!", 400);
    let password = await bcrypt.hash("Test@123", 12);

    return await adminModel.create({
      name: "Manihar Super Admin",
      email: "test@test.com",
      password,
      role: UserRole.SUPER_ADMIN,
      isApproved: ApprovalStatus.APPROVED,
    });
  } catch (error) {
    throw error;
  }
};

/**
 * Add Sub Admin
 */
const addAdmin = async (name: string, email: string, adminRole: string, res: Response) => {
  try {
    let user = await adminModel.findOne({ email });
    if (user) throw helper.buildError("Email already in use", 400);
    let password = randomStr.generate({ length: 8 });
    // let password = "Test@123";
    let hashPassword = await bcrypt.hash(password, 12);

    await adminModel.create({ name, email, password: hashPassword, role: UserRole.ADMIN, adminRole });
    helper.buildResponse(res, "Admin added successfully");

    // send password to user email
    await emailHandler.sentInviteMailToAdmin(name, email, password);
  } catch (error) {
    throw error;
  }
};

/**
 * Update sub admin active status
 */
const updateAdminActiveStatus = async (adminId: string, status: boolean) => {
  try {
    let admin = await adminModel.findOne({ _id: adminId, role: UserRole.ADMIN });
    if (!admin) throw helper.buildError("No admin found with this id", 404);
    await admin.set({ isActive: status }).save();
  } catch (error) {
    throw error;
  }
};

const saveConfigInfo = async (body: any) => {
  let info = await configModel.findOne({});
  if (info) await info.set(body).save();
  else await configModel.create(body);
};

const getConfigInfo = async () => {
  let data: any = await configModel.findOne({}).lean();
  if (!data) return await configModel.create({});
  return data;
};

const deleteAdmin = async (adminId: string) => {
  let admin = await adminModel.findOne({ _id: adminId });
  if (!admin) throw helper.buildError("no admin found with this id", 404);
  await admin.delete();
};

export default {
  getAdmins,
  createSuperAdmin,
  addAdmin,
  updateAdminActiveStatus,
  saveConfigInfo,
  getConfigInfo,
  deleteAdmin,
};
