import { Router } from "express";
import { bdController } from "../../controllers";
import { fileHandler } from "../../utils";
import { isUser } from "../middlewares/isUserAuth";
import validator from "./validator";

const router = Router();

router.post(
  "",
  isUser,
  fileHandler.uploadProductFilesToS3("cart-badaldalo").single("file"),
  validator.addBDProduct,
  bdController.addBDProduct
);
router.delete("/:productId/:variantId", isUser, validator.deleteDBProduct, bdController.deleteDBProduct);
router.get("/clear", isUser, bdController.clearBDProducts);
router.get("", isUser, bdController.getBDProducts);

export default router;
