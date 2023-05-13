import { Router } from "express";
import { cartCtrl } from "../../controllers";
import { fileHandler } from "../../utils";
import { isUser } from "../middlewares/isUserAuth";
import validator from "./validator";

const router = Router();

router.post("", isUser, validator.postAddCartItem, cartCtrl.postAddCartItem);
router.post("/bulk-products", isUser, cartCtrl.postAddCartItems);
router.put(
  "/decrease/:itemId",
  isUser,
  validator.putRemoveCartItem,
  cartCtrl.putDecreaseItemQuantity
);
router.put(
  "/increase/:itemId",
  isUser,
  validator.putRemoveCartItem,
  cartCtrl.putIncreaseItemQuantity
);
router.delete("/:itemId", isUser, validator.putRemoveCartItem, cartCtrl.deleteCartItem);
router.get("/clear", isUser, cartCtrl.getClearCart);
router.get("", isUser, cartCtrl.getCart);

export default router;
