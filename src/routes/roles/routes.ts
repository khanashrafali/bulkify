import { Router } from "express";
import { roleController } from "../../controllers";
import { isAdmin } from "../middlewares/isAdminAuth";
import validator from "./validator";

const router = Router();

router.post("", isAdmin, validator.addRole, roleController.addRole);
router.put("/:roleId", isAdmin, validator.updateRole, roleController.updateRole);
router.get("/:roleId", validator.getRole, roleController.getRole);
router.delete("/:roleId", isAdmin, validator.deleteRole, roleController.deleteRole);
router.get("", validator.getRoles, roleController.getRoles);

export default router;
