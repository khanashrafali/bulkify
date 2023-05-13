import { Router } from "express";
import { variantController } from "../../controllers";
import { isAdmin } from "../middlewares/isAdminAuth";
import validator from "./validator";

const router = Router();

router.post("", isAdmin, validator.addVariant, variantController.addVariant);
router.put("/:variantId", isAdmin, validator.updateVariant, variantController.updateVariant);
router.patch("/:variantId", isAdmin, validator.updateVariantStatus, variantController.updateVariantStatus);
router.get("/by-admin", validator.getVariants, variantController.getVariantsByAdmin);
router.get("/:variantId/by-admin", validator.getVariant, variantController.getVariantByAdmin);
router.get("/:variantId", validator.getVariant, variantController.getVariant);
router.delete("/:variantId", isAdmin, validator.deleteVariant, variantController.deleteVariant);
router.get("", validator.getVariants, variantController.getVariants);

export default router;
