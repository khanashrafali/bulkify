import axios, { AxiosResponse } from "axios";
import { userModel } from "../models";
import { helper } from "../utils";
import { PageInfo } from "../utils/interfaces";

interface ShipRocketErr {
  message: string;
  errors: any;
  status_code: number;
}

const throwSRError = (error: any) => {
  console.log("SR Error", error);
  let myError: any = new Error(error?.response?.data?.message);
  myError.statusCode = error?.response?.data?.status_code;
  myError.data = error?.response?.data?.errors;
  return myError;
};

/**
 * @summary add new pickup location
 */
const addNewPickupLocation = async (body: any) => {
  try {
    let authUser = await getAuthUser();
    let uri = "https://apiv2.shiprocket.in/v1/external/settings/company/addpickup";
    let response = await axios.post(uri, body, {
      headers: getHeaders(authUser),
    });
    let rs = checkResponse(response);
    return rs.address;
  } catch (error: any) {
    throw throwSRError(error);
  }
};

/**
 * @returns pickup locations
 */
const getPickupAddresses = async () => {
  try {
    let authUser = await getAuthUser();
    let response = await axios.get("https://apiv2.shiprocket.in/v1/external/settings/company/pickup", {
      headers: getHeaders(authUser),
    });
    let rs = checkResponse(response);
    return rs.data.shipping_address;
  } catch (error) {
    throw throwSRError(error);
  }
};

/**
 * @returns pickup location
 */
const getPickupAddress = async (pickupLocation: string | number) => {
  try {
    let addresses = await getPickupAddresses();
    return addresses.find((e: any) => e.pickup_location == pickupLocation || e.id == +pickupLocation);
  } catch (error) {
    throw throwSRError(error);
  }
};

const prepareOrder = async (orderInfo: any) => {
  try {
    console.log({ sp: orderInfo.shippingAddress });
    return {
      order_id: +orderInfo.orderId,
      order_date: orderInfo.createdAt,
      pickup_location: orderInfo?.pickupLocation?.pickup_location,
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

      order_items: orderInfo.items.map((e: any) => ({
        name: e.product.name,
        sku: e.variant.SKU,
        units: e.qty,
        selling_price: e.variant.sellingPrice,
      })),

      payment_method: orderInfo.paymentMethod,
      sub_total: orderInfo.total, //Calculated sub total amount in Rupee after deductions.
      length: 12, // The length of the item in cms. Must be more than 0.5.
      breadth: 12, //  The breadth of the item in cms. Must be more than 0.5.
      height: 12, // The height of the item in cms. Must be more than 0.5.
      weight: 0.2, // The weight of the item in kgs. Must be more than 0.
    };
  } catch (error) {
    throw throwSRError(error);
  }
};

// get Headers
const getHeaders = (authUser: any) => {
  let headers: any = { "Content-Type": "application/json" };
  if (authUser) headers["Authorization"] = `Bearer ${authUser.token}`;
  return headers;
};

// Validate Response
const checkResponse = (response: AxiosResponse<any>) => {
  if (response.status >= 400) throw helper.buildError(response.statusText, response.status, response.data);
  return response.data;
};

// Authentication API on ship rocket
const getAuthUser = async (): Promise<any | ShipRocketErr> => {
  try {
    let payload = {
      email: process.env.ShiprocketID,
      password: process.env.ShiprocketPass,
    };
    let response = await axios.post("https://apiv2.shiprocket.in/v1/external/auth/login", payload);
    let rs = checkResponse(response);
    return rs as {
      id: number;
      first_name: string;
      last_name: string;
      email: string;
      company_id: number;
      created_at: string;
      token: string;
    };
  } catch (error) {
    throw throwSRError(error);
  }
};

// Create Custom/Channel Specific Order on ship rocket step 1 - processing
const createOrder = async (orderInfo: any, isChannel: boolean = false): Promise<any | ShipRocketErr> => {
  try {
    let authUser: any = await getAuthUser();
    let url = "https://apiv2.shiprocket.in/v1/external/orders/create";
    url += !isChannel ? `/adhoc` : "";

    let orderObj: any = await prepareOrder(orderInfo);
    let response = await axios.post(url, orderObj, {
      headers: getHeaders(authUser),
    });
    let result = checkResponse(response);
    await generateAWB(result.shipment_id);
    await generateManifest([result.shipment_id]);
    return result;
  } catch (error: any) {
    throw throwSRError(error);
  }
};

// Cancel an Order on ship rocket
const cancelOrder = async (shipRocketOrderIds: number[]): Promise<any | ShipRocketErr> => {
  try {
    let payload = { ids: shipRocketOrderIds };
    let authUser = await getAuthUser();
    let response = await axios.post("https://apiv2.shiprocket.in/v1/external/orders/cancel", payload, {
      headers: getHeaders(authUser),
    });
    let rs = checkResponse(response);
    return rs as { message: string; errors: any; status_code: number };
  } catch (error) {
    throw throwSRError(error);
  }
};

// Generate AWB for Shipment on ship rocket step 2 - ready to Ship
const generateAWB = async (shipment_id: string, courier_id?: string): Promise<any | ShipRocketErr> => {
  try {
    let payload = { shipment_id, courier_id };
    let authUser = await getAuthUser();
    let response = await axios.post("https://apiv2.shiprocket.in/v1/external/courier/assign/awb", payload, {
      headers: getHeaders(authUser),
    });
    let rs = checkResponse(response);
    return rs as { message: string; status_code: number };
  } catch (error) {
    console.log(error);
    throw throwSRError(error);
  }
};

/**
 * Get Details of Specific Shipment
 */
const getShipmentDetails = async (shipmentId: number): Promise<any | ShipRocketErr> => {
  try {
    let authUser = await getAuthUser();
    let response = await axios.get("https://apiv2.shiprocket.in/v1/external/shipments", {
      headers: getHeaders(authUser),
    });
    return checkResponse(response);
  } catch (error) {
    throw throwSRError(error);
  }
};

/**
 * generate menifest
 */
const generateManifest = async (shipment_id: number[]): Promise<any | ShipRocketErr> => {
  try {
    let payload = { shipment_id };
    let authUser = await getAuthUser();
    let response = await axios.post("https://apiv2.shiprocket.in/v1/external/manifests/generate", payload, {
      headers: getHeaders(authUser),
    });
    return checkResponse(response);
  } catch (error) {
    console.log(error);
  }
};

/**
 * print generated menifest
 */
const printMenifest = async (order_ids: number[]): Promise<any | ShipRocketErr> => {
  try {
    let payload = { order_ids };
    let authUser = await getAuthUser();
    let response = await axios.post("https://apiv2.shiprocket.in/v1/external/manifests/print", payload, {
      headers: getHeaders(authUser),
    });
    return checkResponse(response);
  } catch (error) {
    throw throwSRError(error);
  }
};

/**
 * generate labels
 */
const generateLabels = async (shipment_id: number[]): Promise<any | ShipRocketErr> => {
  try {
    let payload = { shipment_id };
    let authUser = await getAuthUser();
    let response = await axios.post("https://apiv2.shiprocket.in/v1/external/courier/generate/label", payload, {
      headers: getHeaders(authUser),
    });
    return checkResponse(response);
  } catch (error) {
    throw throwSRError(error);
  }
};

/**
 * generate invoice
 */
const generateInvoice = async (orderId: number): Promise<any | ShipRocketErr> => {
  try {
    let payload = { ids: [orderId] };
    let authUser = await getAuthUser();
    let response = await axios.post("https://apiv2.shiprocket.in/v1/external/orders/print/invoice", payload, {
      headers: getHeaders(authUser),
    });
    return checkResponse(response);
  } catch (error) {
    throw throwSRError(error);
  }
};

// Request for Shipment Pickup on ship rocket
const shipmentPickRequest = async (shipment_ids: number[]): Promise<any | ShipRocketErr> => {
  try {
    let payload = { shipment_id: shipment_ids };
    let authUser = await getAuthUser();
    let response = await axios.post("https://apiv2.shiprocket.in/v1/external/courier/generate/pickup", payload, {
      headers: getHeaders(authUser),
    });
    return checkResponse(response);
  } catch (error) {
    throw throwSRError(error);
  }
};

// Create a Return Order on ship rocket
const returnOrder = async (orderInfo: any): Promise<any | ShipRocketErr> => {
  try {
    let authUser: any = await getAuthUser();
    let url = "https://apiv2.shiprocket.in/v1/external/orders/create/return";
    let orderObj: any = await prepareOrder(orderInfo);
    let shipmentIds: number[] = [];

    let response = await axios.post(url, orderObj, {
      headers: getHeaders(authUser),
    });
    let result = checkResponse(response);

    shipmentIds.push(result.shipment_id);
    await generateAWB(result.shipment_id);
    await generateManifest([result.shipment_id]);

    // generate labels
    // await generateLabels(shipmentIds);

    return result;
  } catch (error) {
    throw throwSRError(error);
  }
};

// get ship rocket order details by order id
const getOrderDetails = async (orderId: string) => {
  try {
    let URI = `https://apiv2.shiprocket.in/v1/external/orders/show/${orderId}`;
    let authUser = await getAuthUser();
    let response = await axios.get(URI, { headers: getHeaders(authUser) });
    let orderInfo: any = checkResponse(response);
    // orderInfo["invoiceInfo"] = await generateInvoice(orderInfo.data.id);
    // orderInfo["labelInfo"] = await generateLabels([orderInfo.data.shipments.id]);
    // orderInfo["menifestInfo"] = await printMenifest([orderInfo.data.id]);
    return orderInfo;
  } catch (error) {
    throw throwSRError(error);
  }
};

// get ship rocket orders
const getOrders = async (queryParams: any) => {
  try {
    let pageInfo = helper.checkPagination(queryParams);
    let URI = "https://apiv2.shiprocket.in/v1/external/orders";
    let authUser = await getAuthUser();
    let params: any = {};

    if (pageInfo) {
      params.page = pageInfo.page;
      params.per_page = pageInfo.pageSize;
    }

    if (queryParams?.search?.trim()?.length) {
      params.search = queryParams.search?.trim();
    }

    let response = await axios.get(URI, { headers: getHeaders(authUser), params });

    return checkResponse(response);
  } catch (error) {
    throw throwSRError(error);
  }
};

const getOrderTrackData = async (orderId: number) => {
  try {
    let URI = `https://apiv2.shiprocket.in/v1/external/courier/track?order_id=${orderId}`;
    let authUser = await getAuthUser();
    let response = await axios.get(URI, { headers: getHeaders(authUser) });
    return checkResponse(response);
  } catch (error) {
    throw throwSRError(error);
  }
};

export default {
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
