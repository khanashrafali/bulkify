import { Router } from "express";
import { vendorCtrl, hdfcController } from "../../controllers";
import { isUser } from "../middlewares/isUserAuth";
import validator from "./validator";

const router = Router();

router.post("/request", isUser, vendorCtrl.becameAVendor);
router.post("/response", isUser, vendorCtrl.completeVendorProfile);
router.get("/track-status", hdfcController.getOrderStatus);

export default router;
