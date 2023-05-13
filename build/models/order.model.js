"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_delete_1 = __importDefault(require("mongoose-delete"));
const utils_1 = require("../utils");
const interfaces_1 = require("../utils/interfaces");
utils_1.helper.loadEnvFile();
// default: () => helper.getNumId()
const Order = new mongoose_1.default.Schema({
    orderId: { type: String, required: true },
    items: {
        type: [
            {
                product: { type: mongoose_1.default.SchemaTypes.ObjectId, ref: "products", required: true },
                qty: { type: Number, default: 0 },
                variant: { type: Object, required: true },
            },
        ],
        default: [],
    },
    orderStatus: { type: [{ status: String, date: Date, msg: String }], default: [] },
    currentOrderStatus: String,
    currentOrderMsg: String,
    paymentMethod: { type: String, enum: utils_1.CONSTANT.PAYMENT_METHODS },
    paymentStatus: { type: String, enum: utils_1.CONSTANT.PAYMENT_STATUS, default: interfaces_1.PaymentStatus.PENDING },
    shippingAddress: { type: mongoose_1.default.SchemaTypes.ObjectId, ref: "address" },
    date: { type: Date, default: utils_1.helper.currentDate },
    user: { type: mongoose_1.default.SchemaTypes.ObjectId, ref: "users" },
    shippingCharge: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    quantity: { type: Number, default: 0 },
    reviewAvailable: { type: Boolean, default: false },
    rPayOrderId: String,
    rPayPaymentId: String,
    rPaySignature: String,
    SROrderInfo: Object,
}, { timestamps: true });
Order.plugin(mongoose_delete_1.default, { overrideMethods: true });
exports.default = mongoose_1.default.model("orders", Order);
