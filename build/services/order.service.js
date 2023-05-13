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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
const moment_1 = __importDefault(require("moment"));
const razorpay_1 = __importDefault(require("razorpay"));
const json2csv_1 = require("json2csv");
const mongoose_1 = __importDefault(require("mongoose"));
const pdfmake_1 = __importDefault(require("pdfmake"));
const validator_1 = __importDefault(require("validator"));
const _1 = require(".");
const models_1 = require("../models");
const utils_1 = require("../utils");
const constants_1 = require("../utils/constants");
const interfaces_1 = require("../utils/interfaces");
const pdf_format_1 = require("../utils/pdf_format");
utils_1.helper.loadEnvFile();
// initialize Razorpay
const _Razorpay = new razorpay_1.default({ key_id: process.env.RPAY_ID, key_secret: process.env.RPAY_SECRET });
/**
 * populate order data
 */
const _populateOrder = (query) => {
    return query
        .populate({ path: "items", populate: { path: "product", options: { withDeleted: true } } })
        .populate({ path: "shippingAddress", options: { withDeleted: true } })
        .populate({ path: "user", select: "name", options: { withDeleted: true } })
        .lean();
};
/**
 * get order handler
 */
const getOrder = (req, orderId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const condition = { "SROrderInfo.order_id": +orderId };
        let order = yield _populateOrder(models_1.orderModel.findOne(condition));
        if (!order)
            throw utils_1.helper.buildError("No order found with this id", 404);
        let SROrderInfo = yield _1.shiprocketService.getOrderDetails(order.SROrderInfo.order_id);
        let trackData = yield _1.shiprocketService.getOrderTrackData(order.SROrderInfo.order_id);
        return { order, trackData, SROrderInfo };
    }
    catch (error) {
        throw error;
    }
});
/**
 * get order list handler
 */
const getOrders = (req, queryParams) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userToJson = req.user.toJSON();
        const pageInfo = utils_1.helper.checkPagination(queryParams);
        let condition = {
            user: mongoose_1.default.Types.ObjectId(userToJson._id),
            currentOrderStatus: { $ne: interfaces_1.OrderStatus.PENDING },
        };
        if (queryParams.textSearch && validator_1.default.isNumeric(queryParams.textSearch))
            condition.total = validator_1.default.toInt(queryParams.textSearch);
        let docs = [];
        let count = yield models_1.orderModel.countDocuments(condition);
        const mongoQquery = models_1.orderModel.find(condition).sort({ createdAt: -1 });
        if (pageInfo)
            docs = yield _populateOrder(mongoQquery).skip(pageInfo.skip).limit(pageInfo.pageSize);
        else
            docs = yield _populateOrder(mongoQquery);
        docs = yield Promise.all(docs.map((d) => _1.shiprocketService.getOrderDetails(d.SROrderInfo.order_id)));
        docs = docs.map((d) => d.data);
        return utils_1.helper.makePaginatedData(docs, count, pageInfo);
    }
    catch (error) {
        throw error;
    }
});
/**
 * get order list for admin panel
 */
const getOrdersByAdmin = (req, queryParams) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        let condition = { currentOrderStatus: { $ne: interfaces_1.OrderStatus.PENDING } };
        const userToJson = req.user.toJSON();
        const pageInfo = utils_1.helper.checkPagination(queryParams);
        if ((_a = queryParams.textSearch) === null || _a === void 0 ? void 0 : _a.length) {
            condition["$or"] = [{ orderId: { $regex: utils_1.helper.regxEscape(queryParams.textSearch), $options: "i" } }];
            if (validator_1.default.isNumeric(queryParams.textSearch))
                condition["$or"].push({ total: validator_1.default.toInt(queryParams.textSearch) });
        }
        if ("currentOrderStatus" in queryParams)
            condition.currentOrderStatus = queryParams.currentOrderStatus;
        if ("paymentStatus" in queryParams)
            condition.paymentStatus = queryParams.paymentStatus;
        if ("createdAt" in queryParams)
            condition.date = new Date(queryParams.createdAt);
        if ("vendor" in queryParams)
            condition.vendor = queryParams.vendor == "ADMIN" ? null : queryParams.vendor;
        if ("paymentMethod" in queryParams)
            condition.paymentMethod = queryParams.paymentMethod == "PREPAID" ? interfaces_1.PaymentMethod.PREPAID : interfaces_1.PaymentMethod.COD;
        if ("payoutCompelete" in queryParams)
            condition.payoutCompelete = queryParams.payoutCompelete;
        let docs = [];
        const count = yield models_1.orderModel.countDocuments(condition);
        const mongoQuery = models_1.orderModel.find(condition).sort({ createdAt: -1 });
        if (pageInfo)
            docs = yield _populateOrder(mongoQuery).skip(pageInfo.skip).limit(pageInfo.pageSize);
        else
            docs = yield _populateOrder(mongoQuery);
        return utils_1.helper.makePaginatedData(docs, count, pageInfo);
    }
    catch (error) {
        throw error;
    }
});
/**
 * get order list handler
 */
const getOrdersByUserId = (req, userId, queryParams) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        let condition = { vendor: userId };
        const userToJson = req.user.toJSON();
        const pageInfo = utils_1.helper.checkPagination(queryParams);
        if (queryParams.textSearch && validator_1.default.isNumeric(queryParams.textSearch))
            condition.total = validator_1.default.toInt(queryParams.textSearch);
        if ((_b = queryParams.orderStatus) === null || _b === void 0 ? void 0 : _b.length)
            condition.status = queryParams.orderStatus;
        const count = yield models_1.orderModel.countDocuments(condition);
        const mongoQuery = models_1.orderModel.find(condition).sort({ createdAt: -1 });
        let docs = [];
        if (pageInfo)
            docs = yield mongoQuery.skip(pageInfo.skip).limit(pageInfo.pageSize);
        else
            docs = yield mongoQuery;
        return utils_1.helper.makePaginatedData(docs || [], count, pageInfo);
    }
    catch (error) {
        throw error;
    }
});
// create order
const createCODOrder = (req, body, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, e_1, _d, _e;
    let savedOrder = null;
    try {
        let userObj = req.user.toJSON();
        let { items: cartItems, shippingCharges, total } = yield _1.cartService.getCart(userObj._id);
        if (!cartItems.length)
            throw utils_1.helper.buildError("Your cart is empty", 400);
        const newOrderId = yield utils_1.helper.getNumId();
        let totalQty = 0;
        let ordersItems = cartItems.map((ci) => {
            totalQty += ci.quantity;
            return { product: ci.product._id, qty: ci.quantity, variant: ci.variant };
        });
        let savedOrder = yield models_1.orderModel.create({
            orderId: newOrderId,
            items: ordersItems,
            currentOrderStatus: interfaces_1.OrderStatus.PLACED,
            orderStatus: [{ status: interfaces_1.OrderStatus.PLACED, date: new Date(), msg: "" }],
            paymentMethod: interfaces_1.PaymentMethod.COD,
            paymentStatus: interfaces_1.PaymentStatus.PENDING,
            shippingAddress: body.shippingAddress,
            date: utils_1.helper.currentDate,
            user: userObj._id,
            shippingCharges,
            total: total,
            quantity: totalQty,
        });
        yield savedOrder.populate("shippingAddress").populate({ path: "items.product" }).execPopulate();
        let SROrderInfo = yield _1.shiprocketService.createOrder(savedOrder);
        savedOrder = yield savedOrder.set({ SROrderInfo }).save();
        utils_1.helper.buildResponse(res, "Order Placed Successfully.", { orderId: newOrderId, total });
        yield _1.cartService.clearCart(userObj._id);
        try {
            for (var _f = true, cartItems_1 = __asyncValues(cartItems), cartItems_1_1; cartItems_1_1 = yield cartItems_1.next(), _c = cartItems_1_1.done, !_c;) {
                _e = cartItems_1_1.value;
                _f = false;
                try {
                    let ci = _e;
                    let product = yield models_1.productModel.findOne({ _id: ci.product._id });
                    if (!product)
                        throw utils_1.helper.buildError("Something went wrong", 400);
                    let pObj = product.toJSON();
                    let variants = pObj.variants.map((v) => {
                        if (v._id.toString() == ci.variant._id.toString())
                            v.variant.quantity -= ci.quantity;
                        return v;
                    });
                    yield product.set({ variants }).save();
                }
                finally {
                    _f = true;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_f && !_c && (_d = cartItems_1.return)) yield _d.call(cartItems_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    }
    catch (error) {
        if (savedOrder)
            yield savedOrder.remove();
        throw error;
    }
});
// generate order Invoice
const getInvoice = (req, orderId, cb) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let order = yield getOrder(req, orderId);
        if (!order)
            throw utils_1.helper.buildError("No order found with this id", 404);
        // const doc = new pdfKit();
        var printer = new pdfmake_1.default({
            Roboto: {
                normal: utils_1.helper.buildPath("public", "fonts", "Roboto-Regular.ttf"),
                bold: utils_1.helper.buildPath("public", "fonts", "Roboto-Medium.ttf"),
                italics: utils_1.helper.buildPath("public", "fonts", "Roboto-Italic.ttf"),
                bolditalics: utils_1.helper.buildPath("public", "fonts", "Roboto-Italic.ttf"),
            },
        });
        var pdfDoc = printer.createPdfKitDocument((0, pdf_format_1.getInvoicePdf)(order), {});
        let chunks = [];
        pdfDoc.on("data", (chunk) => chunks.push(chunk));
        pdfDoc.on("end", () => cb(Buffer.concat(chunks)));
        pdfDoc.end();
    }
    catch (error) {
        throw error;
    }
});
const getOrderByAdmin = (req, orderId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const condition = { "SROrderInfo.order_id": +orderId };
        let order = yield _populateOrder(models_1.orderModel.findOneWithDeleted(condition));
        if (!order)
            throw utils_1.helper.buildError("no order found with this id", 404);
        let SROrderInfo = yield _1.shiprocketService.getOrderDetails(order.SROrderInfo.order_id);
        return { order, SROrderInfo };
    }
    catch (error) {
        throw error;
    }
});
const updateOrderStatus = (orderId, currentOrderStatus) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const conditions = { _id: orderId };
        let order = yield models_1.orderModel.findOne(conditions);
        if (!order)
            throw utils_1.helper.buildError("no order found with this id", 404);
        let orderObj = order.toJSON();
        let orderStatus = [...orderObj.orderStatus];
        let data = { currentOrderStatus, orderStatus };
        let duplicate = orderStatus.find((os) => os.status == currentOrderStatus);
        if (duplicate)
            throw utils_1.helper.buildError("Duplicate Event not Allowed!", 400);
        if (![interfaces_1.OrderStatus.CANCELLED, interfaces_1.OrderStatus.RETURNED].includes(currentOrderStatus)) {
            if (constants_1.OrderStatusWithSno[currentOrderStatus] < constants_1.OrderStatusWithSno[orderObj.currentOrderStatus]) {
                throw utils_1.helper.buildError("This Event is not Allowed!", 400);
            }
            // let nextEvent = null;
            // OrderStatusWithSno[orderObj.currentOrderStatus as OrderStatus] + 1;
            if (constants_1.OrderStatusWithSno[currentOrderStatus] !=
                constants_1.OrderStatusWithSno[orderObj.currentOrderStatus] + 1) {
                throw utils_1.helper.buildError("Event Should be Ordered.", 400);
            }
        }
        if (currentOrderStatus == interfaces_1.OrderStatus.CANCELLED) {
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
        if (currentOrderStatus == interfaces_1.OrderStatus.RETURNED) {
            // await emailHandler.sentOrderReturnBankMail(orderObj);
        }
        orderStatus.push({ status: currentOrderStatus, date: new Date() });
        yield order.set(data).save();
        return order;
    }
    catch (error) {
        throw error;
    }
});
const updateOrderPaymentStatus = (orderId, paymentStatus) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const conditions = { _id: orderId };
        let order = yield models_1.orderModel.findOne(conditions);
        if (!order)
            throw utils_1.helper.buildError("no order found with this id", 404);
        let orderObj = order.toJSON();
        let data = { paymentStatus };
        if (paymentStatus == interfaces_1.PaymentStatus.COMPLETED && orderObj.paymentMethod == interfaces_1.PaymentMethod.COD)
            data.paymentRecivedAt = (0, moment_1.default)();
        return yield order.set(Object.assign({}, data)).save();
    }
    catch (error) {
        throw error;
    }
});
/**
 * verify signature by razor pay
 */
const _verifyRPaySignature = (orderId, paymentId, signature) => {
    try {
        const generatedSignature = (0, crypto_1.createHmac)("SHA256", process.env.RPAY_SECRET)
            .update(orderId + "|" + paymentId)
            .digest("hex");
        return generatedSignature == signature;
    }
    catch (error) {
        throw error;
    }
};
const _createNewOrder = (req, rPayOrderId, rPayPaymentId, rPaySignature, reasonMessage, isValidSignature) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let userToJson = req.user.toJSON();
        let oldOrder = yield models_1.orderModel
            .findOne({ rPayOrderId, currentOrderStatus: interfaces_1.OrderStatus.PENDING, user: userToJson._id })
            .populate("shippingAddress")
            .populate({ path: "items.product" });
        if (!oldOrder)
            throw utils_1.helper.buildError("no orders found with this id", 404);
        const orderObj = oldOrder.toJSON();
        let SROrderInfo = yield _1.shiprocketService.createOrder(orderObj);
        yield oldOrder
            .set({
            currentOrderStatus: interfaces_1.OrderStatus.PLACED,
            orderStatus: [{ status: interfaces_1.OrderStatus.PLACED, date: new Date(), msg: "" }],
            paymentMethod: interfaces_1.PaymentMethod.PREPAID,
            paymentStatus: isValidSignature ? interfaces_1.PaymentStatus.COMPLETED : interfaces_1.PaymentStatus.CANCELLED,
            rPayOrderId,
            rPayPaymentId,
            rPaySignature,
            reasonMessage,
            SROrderInfo,
        })
            .save();
        yield _1.cartService.clearCart(req.user._id);
        return { orderId: orderObj.orderId, total: orderObj.total };
    }
    catch (error) {
        throw error;
    }
});
// generate razor pay order id
const generateRPayOrder = (req, body, notes = {}) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userToJson = req.user.toJSON();
        let { items, shippingCharges, total } = yield _1.cartService.getCart(req.user._id);
        let totalQty = 0;
        if (!items.length)
            throw utils_1.helper.buildError("Your cart is empty", 400);
        // await manageInventory(items);
        let ordersItems = items.map((ci) => {
            totalQty += ci.quantity;
            return { product: ci.product._id, qty: ci.quantity, variant: ci.variant };
        });
        const newOrderId = yield utils_1.helper.getNumId();
        let rPayOrder = yield _Razorpay.orders.create({
            amount: total * 100,
            currency: "INR",
            receipt: userToJson._id.toString(),
            payment_capture: 1,
            notes: { user: userToJson._id.toString(), orderId: newOrderId },
        });
        yield models_1.orderModel.create({
            orderId: newOrderId,
            items: ordersItems,
            currentOrderStatus: interfaces_1.OrderStatus.PENDING,
            orderStatus: [{ status: interfaces_1.OrderStatus.PENDING, date: new Date(), msg: "" }],
            paymentMethod: interfaces_1.PaymentMethod.PREPAID,
            paymentStatus: interfaces_1.PaymentStatus.PENDING,
            shippingAddress: body.shippingAddress,
            date: utils_1.helper.currentDate,
            user: userToJson._id,
            shippingCharges,
            total: total,
            quantity: totalQty,
            rPayOrderId: rPayOrder.id,
        });
        return rPayOrder;
    }
    catch (error) {
        throw error;
    }
});
/**
 * cancel order handler
 */
const cancelOrderItem = (req, orderId, orderItemId, reasonMessage, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const order = yield models_1.orderModel
            .findOne({ orderId, _id: orderItemId, user: req.user._id })
            .populate({ path: "user" });
        if (!order)
            throw utils_1.helper.buildError("No cancelable order found with this id", 404);
        let orderObj = order.toJSON();
        let orderStatus = [...orderObj.orderStatus];
        let data = { currentOrderStatus: interfaces_1.OrderStatus.CANCELLED, orderStatus, reasonMessage };
        if (orderObj.paymentMethod == interfaces_1.PaymentMethod.COD)
            data.cancelApproval = interfaces_1.ApprovalStatus.APPROVED;
        let cancelled = orderStatus.find((os) => os.status == interfaces_1.OrderStatus.CANCELLED);
        if (cancelled)
            throw utils_1.helper.buildError("Item Already Cancelled.", 400);
        let delivered = orderStatus.find((os) => os.status == interfaces_1.OrderStatus.DELIVERED);
        if (delivered)
            throw utils_1.helper.buildError("Cant cancelled Delivered Product", 400);
        orderStatus.push({ status: interfaces_1.OrderStatus.CANCELLED, date: new Date(), msg: "" });
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
        yield order.set(data).save();
        utils_1.helper.buildResponse(res, "Order item cancelled successfully.");
        yield utils_1.emailHandler.sentOrderCancelMail(orderObj);
    }
    catch (error) {
        throw error;
    }
});
/**
 * cancel order handler
 */
const returnOrderItem = (req, orderId, orderItemId, reasonMessage, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const order = yield models_1.orderModel
            .findOne({ orderId, _id: orderItemId, user: req.user._id })
            .populate({ path: "user" });
        if (!order)
            throw utils_1.helper.buildError("No returnable order found with this id", 404);
        let orderObj = order.toJSON();
        let orderStatus = [...orderObj.orderStatus];
        let data = { currentOrderStatus: interfaces_1.OrderStatus.RETURNED, orderStatus, reasonMessage };
        if (orderObj.paymentMethod == interfaces_1.PaymentMethod.COD)
            data.cancelApproval = interfaces_1.ApprovalStatus.APPROVED;
        if (orderObj.currentOrderStatus != interfaces_1.OrderStatus.DELIVERED)
            throw utils_1.helper.buildError("Cant returned this Product", 400);
        let isReturned = orderStatus.find((os) => os.status == interfaces_1.OrderStatus.RETURNED);
        if (isReturned)
            throw utils_1.helper.buildError("Item Already Returned.", 400);
        // let delivered = orderStatus.find((os) => os.status == OrderStatus.DELIVERED);
        // if (delivered) throw helper.buildError("Cant returned this Product", 400);
        orderStatus.push({ status: interfaces_1.OrderStatus.CANCELLED, date: new Date(), msg: "" });
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
        yield order.set(data).save();
        utils_1.helper.buildResponse(res, "Order item returned successfully.");
        yield utils_1.emailHandler.sentOrderReturnMail(orderObj);
    }
    catch (error) {
        throw error;
    }
});
/**
 * cancel order handler
 */
const cancelOrder = (req, orderId, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const order = yield models_1.orderModel.findOne({ "SROrderInfo.order_id": +orderId, user: req.user._id });
        if (!order)
            throw utils_1.helper.buildError("No cancelable order found with this id", 404);
        let orderObj = order.toJSON();
        let orderStatus = [...orderObj.orderStatus];
        orderStatus.push({ status: interfaces_1.OrderStatus.CANCELLED, date: new Date(), msg: "" });
        yield _1.shiprocketService.cancelOrder([orderObj.SROrderInfo.order_id]);
        yield order.set({ currentOrderStatus: interfaces_1.OrderStatus.CANCELLED, orderStatus }).save();
        utils_1.helper.buildResponse(res, "Order cancelled successfully.");
    }
    catch (error) {
        throw error;
    }
});
const confirmOrder = (paymentInfo, status, msg) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let orders = yield models_1.orderModel.find({ orderId: paymentInfo.order_id });
        if (!(orders === null || orders === void 0 ? void 0 : orders.length))
            throw utils_1.helper.buildError("no order found with this order id", 404);
        yield models_1.orderModel.updateMany({ orderId: paymentInfo.order_id }, {
            $set: {
                currentOrderStatus: status ? interfaces_1.OrderStatus.PLACED : interfaces_1.OrderStatus.CANCELLED,
                orderStatus: [
                    {
                        status: status ? interfaces_1.OrderStatus.PLACED : interfaces_1.OrderStatus.CANCELLED,
                        date: new Date(),
                        msg: "",
                    },
                ],
                paymentStatus: status ? interfaces_1.PaymentStatus.COMPLETED : interfaces_1.PaymentStatus.CANCELLED,
                paymentInfo,
                reasonMsg: msg,
            },
        });
    }
    catch (error) {
        throw error;
    }
});
const confirmCancelOrder = (paymentInfo) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let order = yield models_1.orderModel.findOne({ orderId: paymentInfo.order_id });
        if (!order)
            throw utils_1.helper.buildError("no order found with this order id", 404);
        yield order
            .set({
            currentOrderStatus: interfaces_1.OrderStatus.CANCELLED,
            orderStatus: [{ status: interfaces_1.OrderStatus.CANCELLED, date: new Date(), msg: paymentInfo.failure_message }],
            paymentStatus: interfaces_1.PaymentStatus.CANCELLED,
            paymentInfo,
        })
            .save();
    }
    catch (error) {
        throw error;
    }
});
const updateOrderRequest = (id, orderId, type, status) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const conditions = { _id: id, orderId };
        let order = yield models_1.orderModel.findOne(conditions);
        if (!order)
            throw utils_1.helper.buildError("no order found with this id", 404);
        let data = {};
        let orderObj = order.toJSON();
        if (type == "CANCEL")
            data.cancelApproval = status;
        else if (type == "RETURN")
            data.returnApproval = status;
        else
            throw utils_1.helper.buildError("please sent valid type like CANCEL,RETURN", 400);
        // sent email to bank and client
        yield order.set(Object.assign({}, data)).save();
        let product = yield models_1.productModel.findById(orderObj.product);
        if (!product)
            return;
        let pObj = product.toJSON();
        let variants = pObj.variants.map((v) => {
            if (v._id.toString() == orderObj.variant._id.toString())
                v.variant.quantity += (orderObj === null || orderObj === void 0 ? void 0 : orderObj.quantity) || 0;
            return v;
        });
        yield product.set({ variants }).save();
        // if (type == "CANCEL") await emailHandler.sentOrderCancelBankMail(orderObj);
        // else if (type == "RETURN") await emailHandler.sentOrderReturnBankMail(orderObj);
    }
    catch (error) {
        throw error;
    }
});
const downloadAllOrders = () => __awaiter(void 0, void 0, void 0, function* () {
    var _g, _h;
    let orders = yield models_1.orderModel.find({}).populate("product").lean();
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
    const csvParser = new json2csv_1.Parser({ fields: csvFields });
    let jsonProducts = [];
    for (let o of orders) {
        if (!((_g = o.product) === null || _g === void 0 ? void 0 : _g.name))
            continue;
        let obj = {
            "Order ID": o.orderId,
            Product: (_h = o.product) === null || _h === void 0 ? void 0 : _h.name,
            SKU: o.variant.SKU,
            "Payment Status": o.paymentStatus,
            "Shipping Charge": o.shippingCharge,
            Total: o.total,
            Quantity: o.quantity,
            "Order Status": o.currentOrderStatus,
            "Payment Method": o.paymentMethod,
            Date: (0, moment_1.default)(o.updatedAt).format("DD-MM-YYYY hh:mm A"),
        };
        jsonProducts.push(obj);
    }
    let csvData = csvParser.parse(jsonProducts);
    return csvData;
});
const placeOrder = (req, rPayOrderId, rPayPaymentId, rPaySignature, reasonMessage, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { items } = yield _1.cartService.getCart(req.user._id);
        if (!items.length)
            throw utils_1.helper.buildError("Your cart is empty.", 400);
        // verify razor pay signature
        const isValidSignature = _verifyRPaySignature(rPayOrderId, rPayPaymentId, rPaySignature);
        let result = yield _createNewOrder(req, rPayOrderId, rPayPaymentId, rPaySignature, reasonMessage, isValidSignature);
        utils_1.helper.buildResponse(res, "Order Placed Successfully.", result);
        // if (result) {
        //   let { savedOrderInfo, newOrder } = result;
        //   // start making transactions
        //   // clear user cart
        //   await cartService.clearCart(req);
        //   // sent order confirmation mail
        //   await emailHandler.sentPlaceOrderMail(newOrder, req.user);
        // }
    }
    catch (error) {
        throw error;
    }
});
exports.default = {
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
