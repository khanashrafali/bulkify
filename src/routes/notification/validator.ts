import { body, CustomValidator, param } from "express-validator";
import { addressModel } from "../../models";
import { CONSTANT, helper } from "../../utils";
import { IRequest } from "../../utils/interfaces";

const saveNotification = [body("msg", "Please enter valid msg").exists().trim().notEmpty()];

const getNotification = [param("id", "Please enter valid id").exists().trim().isMongoId()];

const getNotifications: any[] = [];

const updateNotification = [...getNotification, ...saveNotification];

const deleteNotification = [...getNotification];

export default {
  saveNotification,
  getNotifications,
  updateNotification,
  getNotification,
  deleteNotification,
};
