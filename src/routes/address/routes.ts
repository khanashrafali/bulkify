import { Router } from "express";
import { addressCtrl } from "../../controllers";
import { isUser } from "../middlewares/isUserAuth";
import validator from "./validator";

const router = Router();

router.post("", isUser, addressCtrl.postSaveAddress);
router.get("", isUser, addressCtrl.getAddresses);
router.put("/:addressId", isUser, validator.putUpdateAddress, addressCtrl.putUpdateAddress);
router.put("/default/:addressId", isUser, validator.getAddress, addressCtrl.putSetDefaultAddress);
router.get("/:addressId", isUser, validator.getAddress, addressCtrl.getAddress);
router.delete("/:addressId", isUser, validator.deleteAddress, addressCtrl.deleteAddress);

export default router;
