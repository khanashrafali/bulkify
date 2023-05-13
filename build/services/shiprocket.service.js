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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const utils_1 = require("../utils");
const throwSRError = (error) => {
    var _a, _b, _c, _d, _e, _f;
    console.log("SR Error", error);
    let myError = new Error((_b = (_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message);
    myError.statusCode = (_d = (_c = error === null || error === void 0 ? void 0 : error.response) === null || _c === void 0 ? void 0 : _c.data) === null || _d === void 0 ? void 0 : _d.status_code;
    myError.data = (_f = (_e = error === null || error === void 0 ? void 0 : error.response) === null || _e === void 0 ? void 0 : _e.data) === null || _f === void 0 ? void 0 : _f.errors;
    return myError;
};
/**
 * @summary add new pickup location
 */
const addNewPickupLocation = (body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let authUser = yield getAuthUser();
        let uri = "https://apiv2.shiprocket.in/v1/external/settings/company/addpickup";
        let response = yield axios_1.default.post(uri, body, {
            headers: getHeaders(authUser),
        });
        let rs = checkResponse(response);
        return rs.address;
    }
    catch (error) {
        throw throwSRError(error);
    }
});
/**
 * @returns pickup locations
 */
const getPickupAddresses = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let authUser = yield getAuthUser();
        let response = yield axios_1.default.get("https://apiv2.shiprocket.in/v1/external/settings/company/pickup", {
            headers: getHeaders(authUser),
        });
        let rs = checkResponse(response);
        return rs.data.shipping_address;
    }
    catch (error) {
        throw throwSRError(error);
    }
});
/**
 * @returns pickup location
 */
const getPickupAddress = (pickupLocation) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let addresses = yield getPickupAddresses();
        return addresses.find((e) => e.pickup_location == pickupLocation || e.id == +pickupLocation);
    }
    catch (error) {
        throw throwSRError(error);
    }
});
const prepareOrder = (orderInfo) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        console.log({ sp: orderInfo.shippingAddress });
        return {
            order_id: +orderInfo.orderId,
            order_date: orderInfo.createdAt,
            pickup_location: (_a = orderInfo === null || orderInfo === void 0 ? void 0 : orderInfo.pickupLocation) === null || _a === void 0 ? void 0 : _a.pickup_location,
            shipping_is_billing: true,
            billing_customer_name: orderInfo.shippingAddress.name,
            billing_last_name: "",
            billing_address: orderInfo.shippingAddress.address,
            billing_city: orderInfo.shippingAddress.city,
            billing_pincode: orderInfo.shippingAddress.pin_code,
            billing_state: orderInfo.shippingAddress.state,
            billing_country: orderInfo.country || "India",
            billing_email: orderInfo.shippingAddress.email,
            billing_phone: orderInfo.shippingAddress.phone,
            shipping_customer_name: orderInfo.shippingAddress.name,
            shipping_last_name: "",
            shipping_address: orderInfo.shippingAddress.address,
            shipping_city: orderInfo.shippingAddress.city,
            shipping_pincode: orderInfo.shippingAddress.pin_code,
            shipping_country: orderInfo.country || "India",
            shipping_state: orderInfo.shippingAddress.state,
            shipping_email: orderInfo.shippingAddress.email,
            shipping_phone: orderInfo.shippingAddress.phone,
            order_items: orderInfo.items.map((e) => ({
                name: e.product.name,
                sku: e.variant.SKU,
                units: e.qty,
                selling_price: e.variant.sellingPrice,
            })),
            payment_method: orderInfo.paymentMethod,
            sub_total: orderInfo.total,
            length: 12,
            breadth: 12,
            height: 12,
            weight: 0.2, // The weight of the item in kgs. Must be more than 0.
        };
    }
    catch (error) {
        throw throwSRError(error);
    }
});
// get Headers
const getHeaders = (authUser) => {
    let headers = { "Content-Type": "application/json" };
    if (authUser)
        headers["Authorization"] = `Bearer ${authUser.token}`;
    return headers;
};
// Validate Response
const checkResponse = (response) => {
    if (response.status >= 400)
        throw utils_1.helper.buildError(response.statusText, response.status, response.data);
    return response.data;
};
// Authentication API on ship rocket
const getAuthUser = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let payload = {
            email: process.env.ShiprocketID,
            password: process.env.ShiprocketPass,
        };
        let response = yield axios_1.default.post("https://apiv2.shiprocket.in/v1/external/auth/login", payload);
        let rs = checkResponse(response);
        return rs;
    }
    catch (error) {
        throw throwSRError(error);
    }
});
// Create Custom/Channel Specific Order on ship rocket step 1 - processing
const createOrder = (orderInfo, isChannel = false) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let authUser = yield getAuthUser();
        let url = "https://apiv2.shiprocket.in/v1/external/orders/create";
        url += !isChannel ? `/adhoc` : "";
        let orderObj = yield prepareOrder(orderInfo);
        let response = yield axios_1.default.post(url, orderObj, {
            headers: getHeaders(authUser),
        });
        let result = checkResponse(response);
        yield generateAWB(result.shipment_id);
        yield generateManifest([result.shipment_id]);
        return result;
    }
    catch (error) {
        throw throwSRError(error);
    }
});
// Cancel an Order on ship rocket
const cancelOrder = (shipRocketOrderIds) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let payload = { ids: shipRocketOrderIds };
        let authUser = yield getAuthUser();
        let response = yield axios_1.default.post("https://apiv2.shiprocket.in/v1/external/orders/cancel", payload, {
            headers: getHeaders(authUser),
        });
        let rs = checkResponse(response);
        return rs;
    }
    catch (error) {
        throw throwSRError(error);
    }
});
// Generate AWB for Shipment on ship rocket step 2 - ready to Ship
const generateAWB = (shipment_id, courier_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let payload = { shipment_id, courier_id };
        let authUser = yield getAuthUser();
        let response = yield axios_1.default.post("https://apiv2.shiprocket.in/v1/external/courier/assign/awb", payload, {
            headers: getHeaders(authUser),
        });
        let rs = checkResponse(response);
        return rs;
    }
    catch (error) {
        console.log(error);
        throw throwSRError(error);
    }
});
/**
 * Get Details of Specific Shipment
 */
const getShipmentDetails = (shipmentId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let authUser = yield getAuthUser();
        let response = yield axios_1.default.get("https://apiv2.shiprocket.in/v1/external/shipments", {
            headers: getHeaders(authUser),
        });
        return checkResponse(response);
    }
    catch (error) {
        throw throwSRError(error);
    }
});
/**
 * generate menifest
 */
const generateManifest = (shipment_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let payload = { shipment_id };
        let authUser = yield getAuthUser();
        let response = yield axios_1.default.post("https://apiv2.shiprocket.in/v1/external/manifests/generate", payload, {
            headers: getHeaders(authUser),
        });
        return checkResponse(response);
    }
    catch (error) {
        console.log(error);
    }
});
/**
 * print generated menifest
 */
const printMenifest = (order_ids) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let payload = { order_ids };
        let authUser = yield getAuthUser();
        let response = yield axios_1.default.post("https://apiv2.shiprocket.in/v1/external/manifests/print", payload, {
            headers: getHeaders(authUser),
        });
        return checkResponse(response);
    }
    catch (error) {
        throw throwSRError(error);
    }
});
/**
 * generate labels
 */
const generateLabels = (shipment_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let payload = { shipment_id };
        let authUser = yield getAuthUser();
        let response = yield axios_1.default.post("https://apiv2.shiprocket.in/v1/external/courier/generate/label", payload, {
            headers: getHeaders(authUser),
        });
        return checkResponse(response);
    }
    catch (error) {
        throw throwSRError(error);
    }
});
/**
 * generate invoice
 */
const generateInvoice = (orderId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let payload = { ids: [orderId] };
        let authUser = yield getAuthUser();
        let response = yield axios_1.default.post("https://apiv2.shiprocket.in/v1/external/orders/print/invoice", payload, {
            headers: getHeaders(authUser),
        });
        return checkResponse(response);
    }
    catch (error) {
        throw throwSRError(error);
    }
});
// Request for Shipment Pickup on ship rocket
const shipmentPickRequest = (shipment_ids) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let payload = { shipment_id: shipment_ids };
        let authUser = yield getAuthUser();
        let response = yield axios_1.default.post("https://apiv2.shiprocket.in/v1/external/courier/generate/pickup", payload, {
            headers: getHeaders(authUser),
        });
        return checkResponse(response);
    }
    catch (error) {
        throw throwSRError(error);
    }
});
// Create a Return Order on ship rocket
const returnOrder = (orderInfo) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let authUser = yield getAuthUser();
        let url = "https://apiv2.shiprocket.in/v1/external/orders/create/return";
        let orderObj = yield prepareOrder(orderInfo);
        let shipmentIds = [];
        let response = yield axios_1.default.post(url, orderObj, {
            headers: getHeaders(authUser),
        });
        let result = checkResponse(response);
        shipmentIds.push(result.shipment_id);
        yield generateAWB(result.shipment_id);
        yield generateManifest([result.shipment_id]);
        // generate labels
        // await generateLabels(shipmentIds);
        return result;
    }
    catch (error) {
        throw throwSRError(error);
    }
});
// get ship rocket order details by order id
const getOrderDetails = (orderId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let URI = `https://apiv2.shiprocket.in/v1/external/orders/show/${orderId}`;
        let authUser = yield getAuthUser();
        let response = yield axios_1.default.get(URI, { headers: getHeaders(authUser) });
        let orderInfo = checkResponse(response);
        // orderInfo["invoiceInfo"] = await generateInvoice(orderInfo.data.id);
        // orderInfo["labelInfo"] = await generateLabels([orderInfo.data.shipments.id]);
        // orderInfo["menifestInfo"] = await printMenifest([orderInfo.data.id]);
        return orderInfo;
    }
    catch (error) {
        throw throwSRError(error);
    }
});
// get ship rocket orders
const getOrders = (queryParams) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c, _d;
    try {
        let pageInfo = utils_1.helper.checkPagination(queryParams);
        let URI = "https://apiv2.shiprocket.in/v1/external/orders";
        let authUser = yield getAuthUser();
        let params = {};
        if (pageInfo) {
            params.page = pageInfo.page;
            params.per_page = pageInfo.pageSize;
        }
        if ((_c = (_b = queryParams === null || queryParams === void 0 ? void 0 : queryParams.search) === null || _b === void 0 ? void 0 : _b.trim()) === null || _c === void 0 ? void 0 : _c.length) {
            params.search = (_d = queryParams.search) === null || _d === void 0 ? void 0 : _d.trim();
        }
        let response = yield axios_1.default.get(URI, { headers: getHeaders(authUser), params });
        return checkResponse(response);
    }
    catch (error) {
        throw throwSRError(error);
    }
});
const getOrderTrackData = (orderId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let URI = `https://apiv2.shiprocket.in/v1/external/courier/track?order_id=${orderId}`;
        let authUser = yield getAuthUser();
        let response = yield axios_1.default.get(URI, { headers: getHeaders(authUser) });
        return checkResponse(response);
    }
    catch (error) {
        throw throwSRError(error);
    }
});
exports.default = {
    getOrderTrackData,
    createOrder,
    cancelOrder,
    generateAWB,
    shipmentPickRequest,
    returnOrder,
    getAuthUser,
    getOrders,
    getOrderDetails,
    addNewPickupLocation,
    getPickupAddresses,
    getPickupAddress,
    getShipmentDetails,
    generateMenifest: generateManifest,
    generateLabels,
    generateInvoice,
    printMenifest,
};
// razor pay html part
// https://razorpay.com/docs/payment-gateway/server-integration/nodejs/
