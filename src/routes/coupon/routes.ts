import { Router } from "express";
import { couponCtrl } from "../../controllers";
import { UserRole } from "../../utils/interfaces";
import { isAdmin } from "../middlewares/isAdminAuth";
import { isAuth } from "../middlewares/isAuth";
import validator from "./validator";

const router = Router();

router.post("/apply", isAuth(), couponCtrl.postApplyCoupon);
router.post("", isAdmin, validator.postAddCoupon, couponCtrl.postAddCoupon);
router.put("/:couponId", isAdmin, validator.putUpdateCoupon, couponCtrl.putUpdateCoupon);
router.patch("/:couponId", isAdmin, validator.patchUpdateCouponStatus, couponCtrl.patchUpdateCouponStatus);
router.delete("/:couponId", isAdmin, validator.deleteCoupon, couponCtrl.deleteCoupon);
router.get("/applicable/list", validator.getCoupons, couponCtrl.getCouponByUsers);
router.get("/:couponId", isAuth([UserRole.USER, UserRole.SUPER_ADMIN, UserRole.ADMIN]), validator.getCoupon, couponCtrl.getCoupon);
router.get("", isAuth([UserRole.USER, UserRole.SUPER_ADMIN, UserRole.ADMIN]), validator.getCoupons, couponCtrl.getCoupons);

export default router;
