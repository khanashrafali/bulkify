import { addressModel, notificationModel } from "../models";
import { helper } from "../utils";
import { IRequest } from "../utils/interfaces";

helper.loadEnvFile();

/**
 * save user's billing/shipping addresses
 */
const saveNotification = async (req: IRequest, data: any) => {
  try {
    return await notificationModel.create({ ...data });
  } catch (error) {
    throw error;
  }
};

/**
 * fetch user's billing/shipping notification
 */
const getNotification = async (req: IRequest, id: string) => {
  try {
    const notifiction = await notificationModel.findOne({ _id: id });
    return notifiction;
  } catch (error) {
    throw error;
  }
};

/**
 * fetch user's billing/shipping addresses
 */
const getNotifications = async (req: IRequest, queryParams: any) => {
  try {
    let userObj: any = req.user.toJSON();
    let conditions: any = { createdAt: { $gt: userObj.createdAt } };
    const pageInfo = helper.checkPagination(queryParams);

    let mongoQuery = notificationModel.find(conditions).sort({ updatedAt: -1 });

    const count = await notificationModel.countDocuments(conditions);
    let docs: any[] = [];

    if (pageInfo) docs = await mongoQuery.skip(pageInfo.skip).limit(pageInfo.pageSize).lean();
    else docs = await mongoQuery.lean();

    docs = docs.map((noti: any) => {
      if ((noti.readingByUsers as string[]).find((u: any) => u.toString() == req.user._id.toString())) noti.read = true;
      else noti.read = false;
      return noti;
    });

    return helper.makePaginatedData(docs, count, pageInfo);
  } catch (error) {
    throw error;
  }
};

/**
 * update user's billing/shipping addresses
 */
const updateNotification = async (req: IRequest, id: string, data: any) => {
  try {
    const notifiction = await notificationModel.findOne({ _id: id });
    if (!notifiction) throw helper.buildError("No notification found with this id", 404);
    await notifiction.set({ ...data, readingByUsers: [] }).save();
  } catch (error) {
    throw error;
  }
};

/**
 * delete user's billing/shipping notification
 */
const deleteNotification = async (req: IRequest, id: string) => {
  try {
    const notifiction = await notificationModel.findOne({ _id: id });
    if (!notifiction) throw helper.buildError("No notification found with this id", 404);
    return await notifiction.remove();
  } catch (error) {
    throw error;
  }
};

/**
 * delete user's billing/shipping notification
 */
const readNotification = async (req: IRequest, id: string) => {
  try {
    const notifiction = await notificationModel.findOne({ _id: id });
    if (!notifiction) throw helper.buildError("No notification found with this id", 404);
    let notiObj: any = notifiction.toJSON();
    let users = [...notiObj.readingByUsers];
    users.push(req.user._id);
    return await notifiction.set({ readingByUsers: users }).save();
  } catch (error) {
    throw error;
  }
};

export default {
  saveNotification,
  getNotification,
  getNotifications,
  updateNotification,
  deleteNotification,
  readNotification,
};
