"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../../controllers");
const isAdminAuth_1 = require("../middlewares/isAdminAuth");
const validator_1 = __importDefault(require("./validator"));
const order_controller_1 = __importDefault(require("../../controllers/order.controller"));
const router = (0, express_1.Router)();
router.get("/test", (req, res) => {
    console.log("called");
    res.json({ msg: "done" });
});
router.get("/orders", isAdminAuth_1.isAdmin, controllers_1.shipRocketCtrl.getOrders);
router.get("/orders/:orderId", isAdminAuth_1.isAdmin, order_controller_1.default.getOrder);
router.get("/generate-invoice/:orderId", isAdminAuth_1.isAdmin, controllers_1.shipRocketCtrl.getGenerateInvoice);
router.get("/generate-labels/:shipmentId", isAdminAuth_1.isAdmin, controllers_1.shipRocketCtrl.getGenerateLabel);
router.get("/generate-menifest/:orderId", isAdminAuth_1.isAdmin, controllers_1.shipRocketCtrl.getGenerateMenifest);
router.post("/pickup-address", isAdminAuth_1.isAdmin, validator_1.default.postSaveAddress, controllers_1.shipRocketCtrl.postAddPickupAddress);
router.get("/pickup-addresses", isAdminAuth_1.isAdmin, controllers_1.shipRocketCtrl.getPickupAddresses);
router.get("/pickup-address/:pickupLocation", isAdminAuth_1.isAdmin, controllers_1.shipRocketCtrl.getPickupAddress);
router.get("/shipment-info/:shipmentId", isAdminAuth_1.isAdmin, controllers_1.shipRocketCtrl.getShipmentDetails);
router.get("/track-order/:orderId", isAdminAuth_1.isAdmin, controllers_1.shipRocketCtrl.getOrderTrackInfo);
exports.default = router;
