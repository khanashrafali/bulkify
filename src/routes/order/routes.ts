import { Router } from "express";
import { orderCtrl } from "../../controllers";
import { isAuth } from "../middlewares/isAuth";
import { isUser } from "../middlewares/isUserAuth";
import { isAdmin } from "../middlewares/isAdminAuth";
import { isVendor } from "../middlewares/isVendorAuth";
import validator from "./validator";
import { fileHandler } from "../../utils";

const router = Router();

// router.post("/generate-razor-pay-order", isUser, orderCtrl.generateRPayOrder);
// router.post("/create-order", validator.createOrder, orderCtrl.createOrder);

router.post("/create-rpay-order", isUser, orderCtrl.postCreateRPayOrder);
router.post("/place-order", isUser, orderCtrl.postPlaceOrder);

router.post("/place-cod-order", isUser, validator.createOrder, orderCtrl.createCODOrder);
router.get("/download-orders", orderCtrl.downloadAllOrders);

router.patch("/update-request/:orderId/:id", isAdmin, orderCtrl.updateOrderRequest);
router.put("/return/:orderId/:orderItemId", isAuth(), validator.cancelOrderItem, orderCtrl.returnOrderItem);
router.put("/:orderId/:orderItemId", isAuth(), validator.cancelOrderItem, orderCtrl.cancelOrderItem);
router.put("/:orderId", isAuth(), validator.cancelOrder, orderCtrl.cancelOrder);
router.patch("/status/:orderId", isAdmin, validator.updateOrderStatus, orderCtrl.updateOrderStatus);
router.patch("/payment/:orderId", isAdmin, validator.updateOrderPaymentStatus, orderCtrl.updateOrderPaymentStatus);

router.get("/by-admin", isAdmin, validator.getOrdersByAdmin, orderCtrl.getOrdersByAdmin);
router.get("/by-admin/:orderId", isAdmin, validator.getOrder, orderCtrl.getOrderByAdmin);

router.get("/:orderId", isUser, validator.getOrder, orderCtrl.getOrder);
router.get("/:orderId/invoice", validator.getOrder, orderCtrl.getOrderInvoice);
router.get("", isUser, validator.getOrders, orderCtrl.getOrders);

export default router;
