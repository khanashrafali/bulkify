import { Router } from "express";
import { adminCtrl } from "../../controllers";
import { isAdmin } from "../middlewares/isAdminAuth";
import validator from "./validator";

const router = Router();

router.post("/update/config", isAdmin, adminCtrl.saveConfigInfo);
router.get("/config", isAdmin, adminCtrl.getConfigInfo);
router.get("/", isAdmin, validator.getUsers, adminCtrl.getAdminUsers);
router.post("/", isAdmin, validator.postAddAdmin, adminCtrl.postAddAdmin);
router.patch(
  "/isActive/:adminId",
  isAdmin,
  validator.patchUpdateAdminActiveStatus,
  adminCtrl.patchUpdateAdminActiveStatus
);

router.delete("/:adminId", isAdmin, adminCtrl.deleteAdmin);

export default router;
