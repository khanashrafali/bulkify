import { Router } from "express";
import { transactionCtrl } from "../../controllers";
import { isAdmin } from "../middlewares/isAdminAuth";
import { isAuth } from "../middlewares/isAuth";
import validator from "./validator";

const router = Router();

router.post("", isAdmin, isAdmin, validator.postCreatePayout, transactionCtrl.postCreatePayout);
router.get("/:payoutId", isAdmin, validator.getPayout, transactionCtrl.getPayout);
router.get("", isAdmin, validator.getPayouts, transactionCtrl.getPayouts);

export default router;
