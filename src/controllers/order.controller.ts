import { NextFunction, Request, Response } from "express";

import { addressModel } from "../models";
import { orderService } from "../services";
import { helper } from "../utils";
import { IRequest } from "../utils/interfaces";

const postCreateRPayOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    let order = await orderService.generateRPayOrder(req as IRequest, req.body);
    return helper.buildResponse(res, "Order Created Successfully", order);
  } catch (error) {
    next(error);
  }
};

const postPlaceOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    await orderService.placeOrder(
      req as IRequest,
      req.body.rpay_orderId,
      req.body.rpay_paymentId,
      req.body.rpay_signature,
      req.body.reasonMessage,
      res
    );
  } catch (error) {
    next(error);
  }
};

/**
 * cancel order api
 */
const cancelOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    await orderService.cancelOrder(req as IRequest, req.params.orderId, res);
  } catch (error) {
    next(error);
  }
};

/**
 * cancel order item api
 */
const cancelOrderItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    await orderService.cancelOrderItem(
      req as IRequest,
      req.params.orderId,
      req.params.orderItemId,
      req.body.reasonMessage,
      res
    );
  } catch (error) {
    next(error);
  }
};

const returnOrderItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    await orderService.returnOrderItem(
      req as IRequest,
      req.params.orderId,
      req.params.orderItemId,
      req.body.reasonMessage,
      res
    );
  } catch (error) {
    next(error);
  }
};

/**
 * update order status api
 */
const updateOrderStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    await orderService.updateOrderStatus(req.params.orderId, req.body.status);
    helper.buildResponse(res, "Order Status Updated Successfully.");
  } catch (error) {
    next(error);
  }
};

/**
 * update order payment status api
 */
const updateOrderPaymentStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    await orderService.updateOrderPaymentStatus(req.params.orderId, req.body.status);
    helper.buildResponse(res, "Order Payment Status Updated Successfully.");
  } catch (error) {
    next(error);
  }
};

const updateOrderRequest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    await orderService.updateOrderRequest(req.params.id, req.params.orderId, req.body.type, req.body.status);
    helper.buildResponse(res, "Request Updated Successfully.");
  } catch (error) {
    next(error);
  }
};

/**
 * get single order api
 */
const getOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    let result = await orderService.getOrder(req as IRequest, req.params.orderId);
    helper.buildResponse(res, "Order fetched successfully", result);
  } catch (error) {
    next(error);
  }
};

/**
 * get orders list api
 */
const getOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    let result = await orderService.getOrders(req as IRequest, req.query);
    helper.buildResponse(res, "Orders fetched successfully", result);
  } catch (error) {
    next(error);
  }
};

/**
 * get orders by admin
 */
const getOrdersByAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    let result = await orderService.getOrdersByAdmin(req as IRequest, req.query);
    helper.buildResponse(res, "Orders fetched successfully", result);
  } catch (error) {
    next(error);
  }
};

/**
 * get orders list by user id api
 */
const getOrdersByUserId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    let result = await orderService.getOrdersByUserId(req as IRequest, req.params.userId, req.query);
    helper.buildResponse(res, "Orders fetch successfully", result);
  } catch (error) {
    next(error);
  }
};

const createCODOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);

    let shippingOrder: any = await addressModel.findOne({ _id: req.body.shippingAddress }).lean();
    if (!shippingOrder) throw helper.buildError("no shipping address found with this id", 404);

    await orderService.createCODOrder(req as IRequest, req.body, res);
  } catch (error) {
    next(error);
  }
};

// get order Invoice
const getOrderInvoice = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await orderService.getInvoice(req as IRequest, req.params.orderId, (buffer: any) => {
      res.setHeader("Content-Type", "application/pdf");
      res.send(buffer);
    });
  } catch (error) {
    next(error);
  }
};

const getOrderByAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    let order = await orderService.getOrderByAdmin(req as IRequest, req.params.orderId);
    return helper.buildResponse(res, "Fetch Order Successfully", order);
  } catch (error) {
    next(error);
  }
};

const downloadAllOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    let result = await orderService.downloadAllOrders();
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=orders.csv");
    res.status(200).end(result);
  } catch (error) {
    next(error);
  }
};

export default {
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
