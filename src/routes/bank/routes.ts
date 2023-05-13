import { Router } from "express";
import { bankCtrl } from "../../controllers";
import { isUser } from "../middlewares/isUserAuth";
import validator from "./validator";

const router = Router();

router.post("", isUser, validator.saveBank, bankCtrl.saveBank);
router.get("", isUser, bankCtrl.getBanks);
router.put("/:bankId", isUser, validator.updateBank, bankCtrl.updateBank);
router.put("/default/:bankId", isUser, validator.putSetDefaultBank, bankCtrl.putSetDefaultBank);
router.get("/:bankId", isUser, validator.getBank, bankCtrl.getBank);
router.delete("/:bankId", isUser, validator.deleteBank, bankCtrl.deleteBank);

export default router;
