import { createHmac } from "crypto";
import { Response } from "express";
import moment from "moment";
import Razorpay from "razorpay";
import { Parser } from "json2csv";
import mongoose from "mongoose";
import pdfPrinter from "pdfmake";
import validator from "validator";
import { cartService, shiprocketService } from ".";
import { orderModel, productModel } from "../models";
import { emailHandler, helper } from "../utils";
import { OrderStatusWithSno } from "../utils/constants";
import { ApprovalStatus, IRequest, OrderStatus, PaymentMethod, PaymentStatus } from "../utils/interfaces";
import { getInvoicePdf } from "../utils/pdf_format";
helper.loadEnvFile();

// initialize Razorpay
const _Razorpay = new Razorpay({ key_id: process.env.RPAY_ID, key_secret: process.env.RPAY_SECRET });

/**
 * populate order data
 */
const _populateOrder = (query: any) => {
  return query
    .populate({ path: "items", populate: { path: "product", options: { withDeleted: true } } })
    .populate({ path: "shippingAddress", options: { withDeleted: true } })
    .populate({ path: "user", select: "name", options: { withDeleted: true } })
    .lean();
};

/**
 * get order handler
 */
const getOrder = async (req: IRequest, orderId: string) => {
  try {
    const condition: any = { "SROrderInfo.order_id": +orderId };
    let order = await _populateOrder(orderModel.findOne(condition));
    if (!order) throw helper.buildError("No order found with this id", 404);
    let SROrderInfo = await shiprocketService.getOrderDetails(order.SROrderInfo.order_id);
    let trackData = await shiprocketService.getOrderTrackData(order.SROrderInfo.order_id);
    return { order, trackData, SROrderInfo };
  } catch (error) {
    throw error;
  }
};

/**
 * get order list handler
 */
const getOrders = async (req: IRequest, queryParams: any) => {
  try {
    const userToJson: any = req.user.toJSON();
    const pageInfo = helper.checkPagination(queryParams);
    let condition: any = {
      user: mongoose.Types.ObjectId(userToJson._id),
      currentOrderStatus: { $ne: OrderStatus.PENDING },
    };

    if (queryParams.textSearch && validator.isNumeric(queryParams.textSearch))
      condition.total = validator.toInt(queryParams.textSearch);

    let docs: any[] = [];
    let count = await orderModel.countDocuments(condition);
    const mongoQquery = orderModel.find(condition).sort({ createdAt: -1 });

    if (pageInfo) docs = await _populateOrder(mongoQquery).skip(pageInfo.skip).limit(pageInfo.pageSize);
    else docs = await _populateOrder(mongoQquery);

    docs = await Promise.all(docs.map((d) => shiprocketService.getOrderDetails(d.SROrderInfo.order_id)));
    docs = docs.map((d) => d.data);

    return helper.makePaginatedData(docs, count, pageInfo);
  } catch (error) {
    throw error;
  }
};

/**
 * get order list for admin panel
 */
const getOrdersByAdmin = async (req: IRequest, queryParams: any) => {
  try {
    let condition: any = { currentOrderStatus: { $ne: OrderStatus.PENDING } };
    const userToJson: any = req.user.toJSON();
    const pageInfo = helper.checkPagination(queryParams);

    if (queryParams.textSearch?.length) {
      condition["$or"] = [{ orderId: { $regex: helper.regxEscape(queryParams.textSearch), $options: "i" } }];
      if (validator.isNumeric(queryParams.textSearch))
        condition["$or"].push({ total: validator.toInt(queryParams.textSearch) });
    }

    if ("currentOrderStatus" in queryParams) condition.currentOrderStatus = queryParams.currentOrderStatus;
    if ("paymentStatus" in queryParams) condition.paymentStatus = queryParams.paymentStatus;
    if ("createdAt" in queryParams) condition.date = new Date(queryParams.createdAt);
    if ("vendor" in queryParams) condition.vendor = queryParams.vendor == "ADMIN" ? null : queryParams.vendor;
    if ("paymentMethod" in queryParams)
      condition.paymentMethod = queryParams.paymentMethod == "PREPAID" ? PaymentMethod.PREPAID : PaymentMethod.COD;
    if ("payoutCompelete" in queryParams) condition.payoutCompelete = queryParams.payoutCompelete;

    let docs: any[] = [];
    const count = await orderModel.countDocuments(condition);
    const mongoQuery = orderModel.find(condition).sort({ createdAt: -1 });

    if (pageInfo) docs = await _populateOrder(mongoQuery).skip(pageInfo.skip).limit(pageInfo.pageSize);
    else docs = await _populateOrder(mongoQuery);

    return helper.makePaginatedData(docs, count, pageInfo);
  } catch (error) {
    throw error;
  }
};

/**
 * get order list handler
 */
const getOrdersByUserId = async (req: IRequest, userId: string, queryParams: any) => {
  try {
    let condition: any = { vendor: userId };
    const userToJson: any = req.user.toJSON();
    const pageInfo = helper.checkPagination(queryParams);

    if (queryParams.textSearch && validator.isNumeric(queryParams.textSearch))
      condition.total = validator.toInt(queryParams.textSearch);
    if (queryParams.orderStatus?.length) condition.status = queryParams.orderStatus;

    const count = await orderModel.countDocuments(condition);
    const mongoQuery = orderModel.find(condition).sort({ createdAt: -1 });
    let docs: any[] = [];

    if (pageInfo) docs = await mongoQuery.skip(pageInfo.skip).limit(pageInfo.pageSize);
    else docs = await mongoQuery;

    return helper.makePaginatedData(docs || [], count, pageInfo);
  } catch (error) {
    throw error;
  }
};

// create order
const createCODOrder = async (req: IRequest, body: any, res: Response) => {
  let savedOrder: any = null;
  try {
    let userObj = (req as IRequest).user.toJSON();
    let { items: cartItems, shippingCharges, total } = await cartService.getCart(userObj._id);

    if (!cartItems.length) throw helper.buildError("Your cart is empty", 400);

    const newOrderId = await helper.getNumId();
    let totalQty: number = 0;
    let ordersItems = cartItems.map((ci: any) => {
      totalQty += ci.quantity;
      return { product: ci.product._id, qty: ci.quantity, variant: ci.variant };
    });

    let savedOrder = await orderModel.create({
      orderId: newOrderId,
      items: ordersItems,
      currentOrderStatus: OrderStatus.PLACED,
      orderStatus: [{ status: OrderStatus.PLACED, date: new Date(), msg: "" }],
      paymentMethod: PaymentMethod.COD,
      paymentStatus: PaymentStatus.PENDING,
      shippingAddress: body.shippingAddress,
      date: helper.currentDate,
      user: userObj._id,
      shippingCharges,
      total: total,
      quantity: totalQty,
    });

    await savedOrder.populate("shippingAddress").populate({ path: "items.product" }).execPopulate();
    let SROrderInfo = await shiprocketService.createOrder(savedOrder);

    savedOrder = await savedOrder.set({ SROrderInfo }).save();

    helper.buildResponse(res, "Order Placed Successfully.", { orderId: newOrderId, total });

    await cartService.clearCart(userObj._id);

    for await (let ci of cartItems) {
      let product = await productModel.findOne({ _id: ci.product._id });
      if (!product) throw helper.buildError("Something went wrong", 400);
      let pObj: any = product.toJSON();
      let variants = pObj.variants.map((v: any) => {
        if (v._id.toString() == ci.variant._id.toString()) v.variant.quantity -= ci.quantity;
        return v;
      });
      await product.set({ variants }).save();
    }
  } catch (error) {
    if (savedOrder) await savedOrder.remove();
    throw error;
  }
};

// generate order Invoice
const getInvoice = async (req: IRequest, orderId: string, cb: any) => {
  try {
    let order = await getOrder(req, orderId);
    if (!order) throw helper.buildError("No order found with this id", 404);

    // const doc = new pdfKit();
    var printer: any = new pdfPrinter({
      Roboto: {
        normal: helper.buildPath("public", "fonts", "Roboto-Regular.ttf"),
        bold: helper.buildPath("public", "fonts", "Roboto-Medium.ttf"),
        italics: helper.buildPath("public", "fonts", "Roboto-Italic.ttf"),
        bolditalics: helper.buildPath("public", "fonts", "Roboto-Italic.ttf"),
      },
    });

    var pdfDoc = printer.createPdfKitDocument(getInvoicePdf(order), {});
    let chunks: any[] = [];
    pdfDoc.on("data", (chunk: any) => chunks.push(chunk));
    pdfDoc.on("end", () => cb(Buffer.concat(chunks)));
    pdfDoc.end();
  } catch (error) {
    throw error;
  }
};

const getOrderByAdmin = async (req: IRequest, orderId: string) => {
  try {
    const condition: any = { "SROrderInfo.order_id": +orderId };
    let order: any = await _populateOrder((orderModel as any).findOneWithDeleted(condition));
    if (!order) throw helper.buildError("no order found with this id", 404);
    let SROrderInfo = await shiprocketService.getOrderDetails(order.SROrderInfo.order_id);
    return { order, SROrderInfo };
  } catch (error) {
    throw error;
  }
};

const updateOrderStatus = async (orderId: string, currentOrderStatus: OrderStatus) => {
  try {
    const conditions = { _id: orderId };
    let order = await orderModel.findOne(conditions);
    if (!order) throw helper.buildError("no order found with this id", 404);

    let orderObj: any = order.toJSON();
    let orderStatus = [...orderObj.orderStatus];
    let data: any = { currentOrderStatus, orderStatus };
    let duplicate = orderStatus.find((os: any) => os.status == currentOrderStatus);

    if (duplicate) throw helper.buildError("Duplicate Event not Allowed!", 400);

    if (![OrderStatus.CANCELLED, OrderStatus.RETURNED].includes(currentOrderStatus)) {
      if (OrderStatusWithSno[currentOrderStatus] < OrderStatusWithSno[orderObj.currentOrderStatus as OrderStatus]) {
        throw helper.buildError("This Event is not Allowed!", 400);
      }

      // let nextEvent = null;
      // OrderStatusWithSno[orderObj.currentOrderStatus as OrderStatus] + 1;

      if (
        OrderStatusWithSno[currentOrderStatus] !=
        OrderStatusWithSno[orderObj.currentOrderStatus as OrderStatus] + 1
      ) {
        throw helper.buildError("Event Should be Ordered.", 400);
      }
    }

    if (currentOrderStatus == OrderStatus.CANCELLED) {
      // let product = await productModel.findById(orderObj.product);
      // if (!product) return;
      // let pObj: any = product.toJSON();
      // let variants = pObj.variants.map((v: any) => {
      //   if (v._id.toString() == orderObj.variant._id.toString()) {
      //     v.variant.quantity += orderObj?.quantity || 0;
      //   }
      //   return v;
      // });
      // await product.set({ variants }).save();
      // await emailHandler.sentOrderCancelBankMail(orderObj);
    }

    if (currentOrderStatus == OrderStatus.RETURNED) {
      // await emailHandler.sentOrderReturnBankMail(orderObj);
    }

    orderStatus.push({ status: currentOrderStatus, date: new Date() });
    await order.set(data).save();
    return order;
  } catch (error) {
    throw error;
  }
};

const updateOrderPaymentStatus = async (orderId: string, paymentStatus: PaymentStatus) => {
  try {
    const conditions = { _id: orderId };
    let order = await orderModel.findOne(conditions);
    if (!order) throw helper.buildError("no order found with this id", 404);
    let orderObj: any = order.toJSON();
    let data: any = { paymentStatus };
    if (paymentStatus == PaymentStatus.COMPLETED && orderObj.paymentMethod == PaymentMethod.COD)
      data.paymentRecivedAt = moment();
    return await order.set({ ...data }).save();
  } catch (error) {
    throw error;
  }
};

/**
 * verify signature by razor pay
 */
const _verifyRPaySignature = (orderId: string, paymentId: string, signature: string) => {
  try {
    const generatedSignature = createHmac("SHA256", process.env.RPAY_SECRET as string)
      .update(orderId + "|" + paymentId)
      .digest("hex");

    return generatedSignature == signature;
  } catch (error) {
    throw error;
  }
};

const _createNewOrder = async (
  req: IRequest,
  rPayOrderId: string,
  rPayPaymentId: string,
  rPaySignature: string,
  reasonMessage: string,
  isValidSignature: boolean
) => {
  try {
    let userToJson: any = req.user.toJSON();

    let oldOrder = await orderModel
      .findOne({ rPayOrderId, currentOrderStatus: OrderStatus.PENDING, user: userToJson._id })
      .populate("shippingAddress")
      .populate({ path: "items.product" });

    if (!oldOrder) throw helper.buildError("no orders found with this id", 404);

    const orderObj: any = oldOrder.toJSON();
    let SROrderInfo = await shiprocketService.createOrder(orderObj);

    await oldOrder
      .set({
        currentOrderStatus: OrderStatus.PLACED,
        orderStatus: [{ status: OrderStatus.PLACED, date: new Date(), msg: "" }],
        paymentMethod: PaymentMethod.PREPAID,
        paymentStatus: isValidSignature ? PaymentStatus.COMPLETED : PaymentStatus.CANCELLED,
        rPayOrderId,
        rPayPaymentId,
        rPaySignature,
        reasonMessage,
        SROrderInfo,
      })
      .save();

    await cartService.clearCart(req.user._id);
    return { orderId: orderObj.orderId, total: orderObj.total };
  } catch (error) {
    throw error;
  }
};

// generate razor pay order id
const generateRPayOrder = async (req: IRequest, body: any, notes: object = {}) => {
  try {
    const userToJson: any = req.user.toJSON();
    let { items, shippingCharges, total } = await cartService.getCart(req.user._id);
    let totalQty: number = 0;

    if (!items.length) throw helper.buildError("Your cart is empty", 400);

    // await manageInventory(items);

    let ordersItems = items.map((ci: any) => {
      totalQty += ci.quantity;
      return { product: ci.product._id, qty: ci.quantity, variant: ci.variant };
    });

    const newOrderId = await helper.getNumId();

    let rPayOrder = await _Razorpay.orders.create({
      amount: total * 100,
      currency: "INR",
      receipt: userToJson._id.toString(),
      payment_capture: 1,
      notes: { user: userToJson._id.toString(), orderId: newOrderId },
    });

    await orderModel.create({
      orderId: newOrderId,
      items: ordersItems,
      currentOrderStatus: OrderStatus.PENDING,
      orderStatus: [{ status: OrderStatus.PENDING, date: new Date(), msg: "" }],
      paymentMethod: PaymentMethod.PREPAID,
      paymentStatus: PaymentStatus.PENDING,
      shippingAddress: body.shippingAddress,
      date: helper.currentDate,
      user: userToJson._id,
      shippingCharges,
      total: total,
      quantity: totalQty,
      rPayOrderId: rPayOrder.id,
    });
    return rPayOrder;
  } catch (error) {
    throw error;
  }
};

/**
 * cancel order handler
 */
const cancelOrderItem = async (
  req: IRequest,
  orderId: string,
  orderItemId: string,
  reasonMessage: string,
  res: Response
) => {
  try {
    const order = await orderModel
      .findOne({ orderId, _id: orderItemId, user: req.user._id })
      .populate({ path: "user" });
    if (!order) throw helper.buildError("No cancelable order found with this id", 404);
    let orderObj: any = order.toJSON();
    let orderStatus = [...orderObj.orderStatus];
    let data: any = { currentOrderStatus: OrderStatus.CANCELLED, orderStatus, reasonMessage };

    if (orderObj.paymentMethod == PaymentMethod.COD) data.cancelApproval = ApprovalStatus.APPROVED;

    let cancelled = orderStatus.find((os) => os.status == OrderStatus.CANCELLED);
    if (cancelled) throw helper.buildError("Item Already Cancelled.", 400);

    let delivered = orderStatus.find((os) => os.status == OrderStatus.DELIVERED);
    if (delivered) throw helper.buildError("Cant cancelled Delivered Product", 400);

    orderStatus.push({ status: OrderStatus.CANCELLED, date: new Date(), msg: "" });

    // let product = await productModel.findById(orderObj.product);
    // if (!product) return;
    // let pObj: any = product.toJSON();

    // let variants = pObj.variants.map((v: any) => {
    //   if (v._id.toString() == orderObj.variant._id.toString()) {
    //     v.variant.quantity += orderObj?.quantity || 0;
    //   }
    //   return v;
    // });

    // await product.set({ variants }).save();

    await order.set(data).save();
    helper.buildResponse(res, "Order item cancelled successfully.");
    await emailHandler.sentOrderCancelMail(orderObj);
  } catch (error) {
    throw error;
  }
};

/**
 * cancel order handler
 */
const returnOrderItem = async (
  req: IRequest,
  orderId: string,
  orderItemId: string,
  reasonMessage: string,
  res: Response
) => {
  try {
    const order = await orderModel
      .findOne({ orderId, _id: orderItemId, user: req.user._id })
      .populate({ path: "user" });
    if (!order) throw helper.buildError("No returnable order found with this id", 404);
    let orderObj: any = order.toJSON();
    let orderStatus = [...orderObj.orderStatus];

    let data: any = { currentOrderStatus: OrderStatus.RETURNED, orderStatus, reasonMessage };

    if (orderObj.paymentMethod == PaymentMethod.COD) data.cancelApproval = ApprovalStatus.APPROVED;
    if (orderObj.currentOrderStatus != OrderStatus.DELIVERED)
      throw helper.buildError("Cant returned this Product", 400);

    let isReturned = orderStatus.find((os) => os.status == OrderStatus.RETURNED);
    if (isReturned) throw helper.buildError("Item Already Returned.", 400);

    // let delivered = orderStatus.find((os) => os.status == OrderStatus.DELIVERED);
    // if (delivered) throw helper.buildError("Cant returned this Product", 400);

    orderStatus.push({ status: OrderStatus.CANCELLED, date: new Date(), msg: "" });

    // let product = await productModel.findById(orderObj.product);
    // if (!product) return;
    // let pObj: any = product.toJSON();

    // let variants = pObj.variants.map((v: any) => {
    //   if (v._id.toString() == orderObj.variant._id.toString()) {
    //     v.variant.quantity += orderObj?.quantity || 0;
    //   }
    //   return v;
    // });

    // await product.set({ variants }).save();

    await order.set(data).save();
    helper.buildResponse(res, "Order item returned successfully.");

    await emailHandler.sentOrderReturnMail(orderObj);
  } catch (error) {
    throw error;
  }
};

/**
 * cancel order handler
 */
const cancelOrder = async (req: IRequest, orderId: string, res: Response) => {
  try {
    const order = await orderModel.findOne({ "SROrderInfo.order_id": +orderId, user: req.user._id });

    if (!order) throw helper.buildError("No cancelable order found with this id", 404);

    let orderObj: any = order.toJSON();
    let orderStatus = [...orderObj.orderStatus];
    orderStatus.push({ status: OrderStatus.CANCELLED, date: new Date(), msg: "" });

    await shiprocketService.cancelOrder([orderObj.SROrderInfo.order_id]);
    await order.set({ currentOrderStatus: OrderStatus.CANCELLED, orderStatus }).save();

    helper.buildResponse(res, "Order cancelled successfully.");
  } catch (error) {
    throw error;
  }
};

const confirmOrder = async (paymentInfo: any, status: boolean, msg?: string) => {
  try {
    let orders = await orderModel.find({ orderId: paymentInfo.order_id });
    if (!orders?.length) throw helper.buildError("no order found with this order id", 404);
    await orderModel.updateMany(
      { orderId: paymentInfo.order_id },
      {
        $set: {
          currentOrderStatus: status ? OrderStatus.PLACED : OrderStatus.CANCELLED,
          orderStatus: [
            {
              status: status ? OrderStatus.PLACED : OrderStatus.CANCELLED,
              date: new Date(),
              msg: "",
            },
          ],
          paymentStatus: status ? PaymentStatus.COMPLETED : PaymentStatus.CANCELLED,
          paymentInfo,
          reasonMsg: msg,
        },
      }
    );
  } catch (error) {
    throw error;
  }
};

const confirmCancelOrder = async (paymentInfo: any) => {
  try {
    let order = await orderModel.findOne({ orderId: paymentInfo.order_id });
    if (!order) throw helper.buildError("no order found with this order id", 404);
    await order
      .set({
        currentOrderStatus: OrderStatus.CANCELLED,
        orderStatus: [{ status: OrderStatus.CANCELLED, date: new Date(), msg: paymentInfo.failure_message }],
        paymentStatus: PaymentStatus.CANCELLED,
        paymentInfo,
      })
      .save();
  } catch (error) {
    throw error;
  }
};

const updateOrderRequest = async (id: string, orderId: string, type: string, status: ApprovalStatus) => {
  try {
    const conditions = { _id: id, orderId };
    let order = await orderModel.findOne(conditions);
    if (!order) throw helper.buildError("no order found with this id", 404);
    let data: any = {};
    let orderObj: any = order.toJSON();

    if (type == "CANCEL") data.cancelApproval = status;
    else if (type == "RETURN") data.returnApproval = status;
    else throw helper.buildError("please sent valid type like CANCEL,RETURN", 400);

    // sent email to bank and client
    await order.set({ ...data }).save();

    let product = await productModel.findById(orderObj.product);
    if (!product) return;
    let pObj: any = product.toJSON();

    let variants = pObj.variants.map((v: any) => {
      if (v._id.toString() == orderObj.variant._id.toString()) v.variant.quantity += orderObj?.quantity || 0;
      return v;
    });

    await product.set({ variants }).save();

    // if (type == "CANCEL") await emailHandler.sentOrderCancelBankMail(orderObj);
    // else if (type == "RETURN") await emailHandler.sentOrderReturnBankMail(orderObj);
  } catch (error) {
    throw error;
  }
};

const downloadAllOrders = async () => {
  let orders: any[] = await orderModel.find({}).populate("product").lean();

  const csvFields = [
    "Order ID",
    "Product",
    "SKU",
    "Payment Status",
    "Shipping Charge",
    "Total",
    "Quantity",
    "Order Status",
    "Payment Method",
    "Date",
  ];

  // { csvFields }
  const csvParser = new Parser({ fields: csvFields });
  let jsonProducts: any[] = [];

  for (let o of orders) {
    if (!o.product?.name) continue;
    let obj: any = {
      "Order ID": o.orderId,
      Product: o.product?.name,
      SKU: o.variant.SKU,
      "Payment Status": o.paymentStatus,
      "Shipping Charge": o.shippingCharge,
      Total: o.total,
      Quantity: o.quantity,
      "Order Status": o.currentOrderStatus,
      "Payment Method": o.paymentMethod,
      Date: moment(o.updatedAt).format("DD-MM-YYYY hh:mm A"),
    };
    jsonProducts.push(obj);
  }

  let csvData = csvParser.parse(jsonProducts);

  return csvData;
};

const placeOrder = async (
  req: IRequest,
  rPayOrderId: string,
  rPayPaymentId: string,
  rPaySignature: string,
  reasonMessage: string,
  res: Response
) => {
  try {
    let { items } = await cartService.getCart(req.user._id);
    if (!items.length) throw helper.buildError("Your cart is empty.", 400);

    // verify razor pay signature
    const isValidSignature = _verifyRPaySignature(rPayOrderId, rPayPaymentId, rPaySignature);

    let result = await _createNewOrder(req, rPayOrderId, rPayPaymentId, rPaySignature, reasonMessage, isValidSignature);

    helper.buildResponse(res, "Order Placed Successfully.", result);

    // if (result) {
    //   let { savedOrderInfo, newOrder } = result;
    //   // start making transactions
    //   // clear user cart
    //   await cartService.clearCart(req);
    //   // sent order confirmation mail
    //   await emailHandler.sentPlaceOrderMail(newOrder, req.user);
    // }
  } catch (error) {
    throw error;
  }
};

export default {
  cancelOrder,
  getOrder,
  getOrders,
  getOrdersByUserId,
  createCODOrder,
  getInvoice,
  getOrdersByAdmin,
  getOrderByAdmin,
  updateOrderStatus,
  updateOrderPaymentStatus,
  cancelOrderItem,
  confirmOrder,
  confirmCancelOrder,
  updateOrderRequest,
  returnOrderItem,
  downloadAllOrders,
  generateRPayOrder,
  placeOrder,
};

// razor pay html part
// https://razorpay.com/docs/payment-gateway/server-integration/nodejs/
