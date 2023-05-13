import { Router } from "express";
import { notificationController } from "../../controllers";
import { isAdmin } from "../middlewares/isAdminAuth";
import { isUser } from "../middlewares/isUserAuth";
import validator from "./validator";

const router = Router();

router.post("", isAdmin, validator.saveNotification, notificationController.saveNotification);
router.get("", isUser, validator.getNotifications, notificationController.getNotifications);
router.get("/admin", isAdmin, validator.getNotifications, notificationController.getNotifications);
router.put("/:id", isAdmin, validator.updateNotification, notificationController.updateNotification);
router.get("/:id", isUser, validator.getNotification, notificationController.getNotification);
router.patch("/:id", isUser, validator.getNotification, notificationController.readNotification);
router.delete("/:id", isAdmin, validator.deleteNotification, notificationController.deleteNotification);

export default router;
