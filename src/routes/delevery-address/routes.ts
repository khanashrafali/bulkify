import { Router } from "express";
import { deleveryController } from "../../controllers";
import { fileHandler } from "../../utils";
import { isAdmin } from "../middlewares/isAdminAuth";
import validator from "./validator";

const router = Router();

router.post("", isAdmin, validator.addDeleveryAddress, deleveryController.addDeleveryAddress);
router.post(
  "/upload",
  isAdmin,
  fileHandler.uploadFile(["text/csv"]).single("file"),
  validator.validateParseCSV,
  deleveryController.uploadAddress
);
router.put("/:id", isAdmin, validator.updateDeleveryAddress, deleveryController.updateDeleveryAddress);
router.get("/:id", validator.getDeleveryAddress, deleveryController.getDeleveryAddress);
router.delete("/:id", isAdmin, validator.deleteDeleveryAddress, deleveryController.deleteDeleveryAddress);
router.get("", validator.getDeleveryAddresses, deleveryController.getDeleveryAddresses);

export default router;
