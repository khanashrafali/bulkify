"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const services_1 = require("../services");
const utils_1 = require("../utils");
/**
 * add pickup addresses
 */
const postAddPickupAddress = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        let result = yield services_1.shiprocketService.addNewPickupLocation(req.body);
        utils_1.helper.buildResponse(res, "Pickup location added successfully", result);
    }
    catch (error) {
        next(error);
    }
});
/**
 * get pickup addresses
 */
const getPickupAddresses = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        let result = yield services_1.shiprocketService.getPickupAddresses();
        utils_1.helper.buildResponse(res, "Fetch addresses successfully", result);
    }
    catch (error) {
        next(error);
    }
});
/**
 * get pickup address
 */
const getPickupAddress = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        let result = yield services_1.shiprocketService.getPickupAddress(req.params.pickupLocation);
        utils_1.helper.buildResponse(res, "Fetch address successfully", result);
    }
    catch (error) {
        next(error);
    }
});
/**
 * get shipment info
 */
const getShipmentDetails = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        let result = yield services_1.shiprocketService.getShipmentDetails(+req.params.shipmentId);
        utils_1.helper.buildResponse(res, "Fetch shipment info successfully", result);
    }
    catch (error) {
        next(error);
    }
});
/**
 * get order tracking info
 */
const getOrderTrackInfo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        let result = yield services_1.shiprocketService.getOrderTrackData(+req.params.orderId);
        utils_1.helper.buildResponse(res, "Fetch order track info successfully", result);
    }
    catch (error) {
        next(error);
    }
});
/**
 * generate labels
 */
const getGenerateLabel = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        let result = yield services_1.shiprocketService.generateLabels([+req.params.shipmentId]);
        utils_1.helper.buildResponse(res, "Label generated successfully", result);
    }
    catch (error) {
        next(error);
    }
});
/**
 * generate menifest
 */
const getGenerateMenifest = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        let result = yield services_1.shiprocketService.printMenifest([+req.params.orderId]);
        utils_1.helper.buildResponse(res, "Menifest generated successfully", result);
    }
    catch (error) {
        next(error);
    }
});
/**
 * generate invoice
 */
const getGenerateInvoice = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        let result = yield services_1.shiprocketService.generateInvoice(+req.params.orderId);
        utils_1.helper.buildResponse(res, "Invoice generated successfully", result);
    }
    catch (error) {
        next(error);
    }
});
/**
 * get order details
 */
const getOrderDetails = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        let result = yield services_1.shiprocketService.getOrderDetails(req.params.orderId);
        utils_1.helper.buildResponse(res, "Fetch order details successfully", result);
    }
    catch (error) {
        next(error);
    }
});
/**
 * get orders
 */
const getOrders = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        let result = yield services_1.shiprocketService.getOrders(req.query);
        utils_1.helper.buildResponse(res, "Fetch orders successfully", result);
    }
    catch (error) {
        next(error);
    }
});
exports.default = {
    getPickupAddresses,
    getPickupAddress,
    postAddPickupAddress,
    getShipmentDetails,
    getOrderTrackInfo,
    getGenerateLabel,
    getGenerateMenifest,
    getGenerateInvoice,
    getOrderDetails,
    getOrders,
};
