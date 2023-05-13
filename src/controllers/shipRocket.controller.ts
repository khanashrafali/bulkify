import { NextFunction, Request, Response } from "express";
import { shiprocketService } from "../services";
import { helper } from "../utils";

/**
 * add pickup addresses
 */
const postAddPickupAddress = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    let result = await shiprocketService.addNewPickupLocation(req.body);
    helper.buildResponse(res, "Pickup location added successfully", result);
  } catch (error) {
    next(error);
  }
};

/**
 * get pickup addresses
 */
const getPickupAddresses = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    let result = await shiprocketService.getPickupAddresses();
    helper.buildResponse(res, "Fetch addresses successfully", result);
  } catch (error) {
    next(error);
  }
};

/**
 * get pickup address
 */
const getPickupAddress = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    let result = await shiprocketService.getPickupAddress(req.params.pickupLocation);
    helper.buildResponse(res, "Fetch address successfully", result);
  } catch (error) {
    next(error);
  }
};

/**
 * get shipment info
 */
const getShipmentDetails = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    let result = await shiprocketService.getShipmentDetails(+req.params.shipmentId);
    helper.buildResponse(res, "Fetch shipment info successfully", result);
  } catch (error) {
    next(error);
  }
};

/**
 * get order tracking info
 */
const getOrderTrackInfo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    let result = await shiprocketService.getOrderTrackData(+req.params.orderId);
    helper.buildResponse(res, "Fetch order track info successfully", result);
  } catch (error) {
    next(error);
  }
};

/**
 * generate labels
 */
const getGenerateLabel = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    let result = await shiprocketService.generateLabels([+req.params.shipmentId]);
    helper.buildResponse(res, "Label generated successfully", result);
  } catch (error) {
    next(error);
  }
};

/**
 * generate menifest
 */
const getGenerateMenifest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    let result = await shiprocketService.printMenifest([+req.params.orderId]);
    helper.buildResponse(res, "Menifest generated successfully", result);
  } catch (error) {
    next(error);
  }
};

/**
 * generate invoice
 */
const getGenerateInvoice = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    let result = await shiprocketService.generateInvoice(+req.params.orderId);
    helper.buildResponse(res, "Invoice generated successfully", result);
  } catch (error) {
    next(error);
  }
};

/**
 * get order details
 */
const getOrderDetails = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    let result = await shiprocketService.getOrderDetails(req.params.orderId);
    helper.buildResponse(res, "Fetch order details successfully", result);
  } catch (error) {
    next(error);
  }
};

/**
 * get orders
 */
const getOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    let result = await shiprocketService.getOrders(req.query);
    helper.buildResponse(res, "Fetch orders successfully", result);
  } catch (error) {
    next(error);
  }
};

export default {
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
