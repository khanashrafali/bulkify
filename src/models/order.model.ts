import mongoose from "mongoose";
import mongooseDelete from "mongoose-delete";
import { CONSTANT, helper } from "../utils";
import { ApprovalStatus, PaymentStatus } from "../utils/interfaces";

helper.loadEnvFile();

// default: () => helper.getNumId()
const Order = new mongoose.Schema(
  {
    orderId: { type: String, required: true },
    items: {
      type: [
        {
          product: { type: mongoose.SchemaTypes.ObjectId, ref: "products", required: true },
          qty: { type: Number, default: 0 },
          variant: { type: Object, required: true },
        },
      ],
      default: [],
    },
    orderStatus: { type: [{ status: String, date: Date, msg: String }], default: [] },
    currentOrderStatus: String,
    currentOrderMsg: String,
    paymentMethod: { type: String, enum: CONSTANT.PAYMENT_METHODS },
    paymentStatus: { type: String, enum: CONSTANT.PAYMENT_STATUS, default: PaymentStatus.PENDING },
    shippingAddress: { type: mongoose.SchemaTypes.ObjectId, ref: "address" },
    date: { type: Date, default: helper.currentDate },
    user: { type: mongoose.SchemaTypes.ObjectId, ref: "users" },
    shippingCharge: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    quantity: { type: Number, default: 0 },
    reviewAvailable: { type: Boolean, default: false },
    rPayOrderId: String,
    rPayPaymentId: String,
    rPaySignature: String,
    SROrderInfo: Object,
  },
  { timestamps: true }
);

Order.plugin(mongooseDelete, { overrideMethods: true });

export default mongoose.model("orders", Order);
