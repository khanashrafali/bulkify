import { Router } from "express";
import { contentCtrl } from "../../controllers";
import { isAdmin } from "../middlewares/isAdminAuth";
import validator from "./validator";

const router = Router();

router.post("/", isAdmin, validator.addContent, contentCtrl.addContent);
router.put("/:contentIdOrSlug", isAdmin, validator.updateContent, contentCtrl.updateContent);
router.delete("/:contentIdOrSlug", isAdmin, validator.deleteContent, contentCtrl.deleteContent);
router.get("/:contentIdOrSlug", validator.getContent, contentCtrl.getContent);
router.get("", validator.getContents, contentCtrl.getContents);

export default router;
