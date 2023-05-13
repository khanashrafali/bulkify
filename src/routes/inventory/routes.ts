import { Router } from "express";
import { inventoryCtrl } from "../../controllers";
import { isVendor } from "../middlewares/isVendorAuth";
import validator from "./validator";

const router = Router();

router.put("/update/:productId", isVendor, validator.updateProductStockData, inventoryCtrl.updateProductStockData);

export default router;
