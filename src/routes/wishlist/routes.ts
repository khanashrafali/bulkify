import { Router } from "express";
import { wishlistController } from "../../controllers";
import { isUser } from "../middlewares/isUserAuth";
import validator from "./validator";

const router = Router();

router.post("", isUser, validator.addWishlistItem, wishlistController.addWishlistItem);
router.post("/bulk-products", isUser, wishlistController.addWishlistItems);
router.delete("/:itemId", isUser, validator.deleteWishlistItem, wishlistController.deleteWishlistItem);
router.get("/clear", isUser, wishlistController.clearWishlist);
router.get("", isUser, wishlistController.getWishlist);

export default router;
