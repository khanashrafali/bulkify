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
const models_1 = require("../models");
const services_1 = require("../services");
const utils_1 = require("../utils");
const postCreateRPayOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        let order = yield services_1.orderService.generateRPayOrder(req, req.body);
        return utils_1.helper.buildResponse(res, "Order Created Successfully", order);
    }
    catch (error) {
        next(error);
    }
});
const postPlaceOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        yield services_1.orderService.placeOrder(req, req.body.rpay_orderId, req.body.rpay_paymentId, req.body.rpay_signature, req.body.reasonMessage, res);
    }
    catch (error) {
        next(error);
    }
});
/**
 * cancel order api
 */
const cancelOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        yield services_1.orderService.cancelOrder(req, req.params.orderId, res);
    }
    catch (error) {
        next(error);
    }
});
/**
 * cancel order item api
 */
const cancelOrderItem = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        yield services_1.orderService.cancelOrderItem(req, req.params.orderId, req.params.orderItemId, req.body.reasonMessage, res);
    }
    catch (error) {
        next(error);
    }
});
const returnOrderItem = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        yield services_1.orderService.returnOrderItem(req, req.params.orderId, req.params.orderItemId, req.body.reasonMessage, res);
    }
    catch (error) {
        next(error);
    }
});
/**
 * update order status api
 */
const updateOrderStatus = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        yield services_1.orderService.updateOrderStatus(req.params.orderId, req.body.status);
        utils_1.helper.buildResponse(res, "Order Status Updated Successfully.");
    }
    catch (error) {
        next(error);
    }
});
/**
 * update order payment status api
 */
const updateOrderPaymentStatus = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        yield services_1.orderService.updateOrderPaymentStatus(req.params.orderId, req.body.status);
        utils_1.helper.buildResponse(res, "Order Payment Status Updated Successfully.");
    }
    catch (error) {
        next(error);
    }
});
const updateOrderRequest = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        yield services_1.orderService.updateOrderRequest(req.params.id, req.params.orderId, req.body.type, req.body.status);
        utils_1.helper.buildResponse(res, "Request Updated Successfully.");
    }
    catch (error) {
        next(error);
    }
});
/**
 * get single order api
 */
const getOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        let result = yield services_1.orderService.getOrder(req, req.params.orderId);
        utils_1.helper.buildResponse(res, "Order fetched successfully", result);
    }
    catch (error) {
        next(error);
    }
});
/**
 * get orders list api
 */
const getOrders = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        let result = yield services_1.orderService.getOrders(req, req.query);
        utils_1.helper.buildResponse(res, "Orders fetched successfully", result);
    }
    catch (error) {
        next(error);
    }
});
/**
 * get orders by admin
 */
const getOrdersByAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        let result = yield services_1.orderService.getOrdersByAdmin(req, req.query);
        utils_1.helper.buildResponse(res, "Orders fetched successfully", result);
    }
    catch (error) {
        next(error);
    }
});
/**
 * get orders list by user id api
 */
const getOrdersByUserId = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        let result = yield services_1.orderService.getOrdersByUserId(req, req.params.userId, req.query);
        utils_1.helper.buildResponse(res, "Orders fetch successfully", result);
    }
    catch (error) {
        next(error);
    }
});
const createCODOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        let shippingOrder = yield models_1.addressModel.findOne({ _id: req.body.shippingAddress }).lean();
        if (!shippingOrder)
            throw utils_1.helper.buildError("no shipping address found with this id", 404);
        yield services_1.orderService.createCODOrder(req, req.body, res);
    }
    catch (error) {
        next(error);
    }
});
// get order Invoice
const getOrderInvoice = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield services_1.orderService.getInvoice(req, req.params.orderId, (buffer) => {
            res.setHeader("Content-Type", "application/pdf");
            res.send(buffer);
        });
    }
    catch (error) {
        next(error);
    }
});
const getOrderByAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        let order = yield services_1.orderService.getOrderByAdmin(req, req.params.orderId);
        return utils_1.helper.buildResponse(res, "Fetch Order Successfully", order);
    }
    catch (error) {
        next(error);
    }
});
const downloadAllOrders = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        let result = yield services_1.orderService.downloadAllOrders();
        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", "attachment; filename=orders.csv");
        res.status(200).end(result);
    }
    catch (error) {
        next(error);
    }
});
exports.default = {
    getOrder,
    getOrders,
    cancelOrder,
    getOrderInvoice,
    getOrdersByAdmin,
    getOrdersByUserId,
    getOrderByAdmin,
    createCODOrder,
    updateOrderPaymentStatus,
    updateOrderStatus,
    cancelOrderItem,
    updateOrderRequest,
    returnOrderItem,
    downloadAllOrders,
    postCreateRPayOrder,
    postPlaceOrder,
};
// 628cc0e2b46a8a1789dfccd9
// 628cc0e2b46a8a1789dfccda
