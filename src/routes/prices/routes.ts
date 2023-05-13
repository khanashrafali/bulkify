import { Router } from "express";
import { priceCtrl } from "../../controllers";
import { isAdmin } from "../middlewares/isAdminAuth";
import { isUser } from "../middlewares/isUserAuth";
import validator from "./validator";

const router = Router();

router.post("", isAdmin, validator.addPrice, priceCtrl.addPrice);
router.get("/by-key/:key", priceCtrl.fetchPriceByKey);
router.get("/:priceId", validator.deletePrice, priceCtrl.fetchPrice);
router.put("/:priceId", isAdmin, validator.updatePrice, priceCtrl.updatePrice);
router.get("", validator.getPrices, priceCtrl.getPrices);
router.delete("/:priceId", isAdmin, validator.deletePrice, priceCtrl.deletePrice);

export default router;
