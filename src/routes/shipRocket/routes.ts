import { Router } from "express";
import { shipRocketCtrl } from "../../controllers";
import { isAuth } from "../middlewares/isAuth";
import { isAdmin } from "../middlewares/isAdminAuth";
import validator from "./validator";
import orderController from "../../controllers/order.controller";

const router = Router();

router.get("/test", (req, res) => {
  console.log("called");
  res.json({ msg: "done" });
});

router.get("/orders", isAdmin, shipRocketCtrl.getOrders);
router.get("/orders/:orderId", isAdmin, orderController.getOrder);
router.get("/generate-invoice/:orderId", isAdmin, shipRocketCtrl.getGenerateInvoice);
router.get("/generate-labels/:shipmentId", isAdmin, shipRocketCtrl.getGenerateLabel);
router.get("/generate-menifest/:orderId", isAdmin, shipRocketCtrl.getGenerateMenifest);
router.post("/pickup-address", isAdmin, validator.postSaveAddress, shipRocketCtrl.postAddPickupAddress);
router.get("/pickup-addresses", isAdmin, shipRocketCtrl.getPickupAddresses);
router.get("/pickup-address/:pickupLocation", isAdmin, shipRocketCtrl.getPickupAddress);
router.get("/shipment-info/:shipmentId", isAdmin, shipRocketCtrl.getShipmentDetails);
router.get("/track-order/:orderId", isAdmin, shipRocketCtrl.getOrderTrackInfo);

export default router;
