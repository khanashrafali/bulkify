"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
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
exports.OrderController = void 0;
const tsoa_1 = require("tsoa");
const interfaces_1 = require("../../utils/interfaces");
let OrderController = class OrderController extends tsoa_1.Controller {
    /**
     * @summary place order
     */
    placeOrder(requestBody) {
        return __awaiter(this, void 0, void 0, function* () {
            return {};
        });
    }
    /**
     * @summary buy now order
     */
    buyNowOrder(requestBody) {
        return __awaiter(this, void 0, void 0, function* () {
            return {};
        });
    }
    /**
     * @summary generate ship rocket order id
     */
    getOrderId(requestBody) {
        return __awaiter(this, void 0, void 0, function* () {
            return {};
        });
    }
    /**
     * @summary cancel order
     */
    cancelOrder(orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            return {};
        });
    }
    /**
     * @summary cancel order item
     */
    cancelOrderItem(orderId, orderItemId) {
        return __awaiter(this, void 0, void 0, function* () {
            return {};
        });
    }
    /**
     * @summary return order
     */
    returnOrder(orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            return {};
        });
    }
    /**
     * @summary get order
     */
    getOrder(orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            return {};
        });
    }
    /**
     * @summary get orders
     */
    getOrders(page, pageSize, textSearch, paymentStatus, orderStatus, createdAt) {
        return __awaiter(this, void 0, void 0, function* () {
            return {};
        });
    }
    /**
     * @summary get order invoice
     */
    getOrdersInvoice(orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            return {};
        });
    }
    /**
     * @summary get orders by vendor
     */
    getOrdersByVendor(page, pageSize, textSearch, paymentStatus, createdAt) {
        return __awaiter(this, void 0, void 0, function* () {
            return {};
        });
    }
    /**
     * @summary get order by vendor
     */
    getOrderByVendor(orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            return {};
        });
    }
    /**
     * @summary get orders by admin
     */
    getOrdersByAdmin(page, pageSize, textSearch, paymentStatus, orderStatus, createdAt) {
        return __awaiter(this, void 0, void 0, function* () {
            return {};
        });
    }
    /**
     * @summary get order by Admin
     */
    getOrderByAdmin(orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            return {};
        });
    }
    /**
     * @summary get orders by user Id
     */
    getOrdersByUserId(userId, page, pageSize, textSearch, paymentStatus, orderStatus, createdAt) {
        return __awaiter(this, void 0, void 0, function* () {
            return {};
        });
    }
};
__decorate([
    (0, tsoa_1.Security)("Bearer"),
    (0, tsoa_1.Post)("place-order"),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "placeOrder", null);
__decorate([
    (0, tsoa_1.Security)("Bearer"),
    (0, tsoa_1.Post)("buy-now"),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "buyNowOrder", null);
__decorate([
    (0, tsoa_1.Security)("Bearer"),
    (0, tsoa_1.Post)("create-rpay-order"),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "getOrderId", null);
__decorate([
    (0, tsoa_1.Security)("Bearer"),
    (0, tsoa_1.Put)("{orderId}"),
    __param(0, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "cancelOrder", null);
__decorate([
    (0, tsoa_1.Security)("Bearer"),
    (0, tsoa_1.Put)("{orderId}/{orderItemId}"),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "cancelOrderItem", null);
__decorate([
    (0, tsoa_1.Security)("Bearer"),
    (0, tsoa_1.Put)("return/{orderId}"),
    __param(0, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "returnOrder", null);
__decorate([
    (0, tsoa_1.Security)("Bearer"),
    (0, tsoa_1.Get)("{orderId}"),
    __param(0, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "getOrder", null);
__decorate([
    (0, tsoa_1.Security)("Bearer"),
    (0, tsoa_1.Get)(""),
    __param(0, (0, tsoa_1.Query)()),
    __param(1, (0, tsoa_1.Query)()),
    __param(2, (0, tsoa_1.Query)()),
    __param(3, (0, tsoa_1.Query)()),
    __param(4, (0, tsoa_1.Query)()),
    __param(5, (0, tsoa_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String, String, Date]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "getOrders", null);
__decorate([
    (0, tsoa_1.Security)("Bearer"),
    (0, tsoa_1.Get)("{orderId}/invoice"),
    __param(0, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "getOrdersInvoice", null);
__decorate([
    (0, tsoa_1.Security)("Bearer"),
    (0, tsoa_1.Get)("by-vendor"),
    __param(0, (0, tsoa_1.Query)()),
    __param(1, (0, tsoa_1.Query)()),
    __param(2, (0, tsoa_1.Query)()),
    __param(3, (0, tsoa_1.Query)()),
    __param(4, (0, tsoa_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String, Date]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "getOrdersByVendor", null);
__decorate([
    (0, tsoa_1.Security)("Bearer"),
    (0, tsoa_1.Get)("by-vendor/{orderId}"),
    __param(0, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "getOrderByVendor", null);
__decorate([
    (0, tsoa_1.Security)("Bearer"),
    (0, tsoa_1.Get)("by-admin"),
    __param(0, (0, tsoa_1.Query)()),
    __param(1, (0, tsoa_1.Query)()),
    __param(2, (0, tsoa_1.Query)()),
    __param(3, (0, tsoa_1.Query)()),
    __param(4, (0, tsoa_1.Query)()),
    __param(5, (0, tsoa_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String, String, Date]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "getOrdersByAdmin", null);
__decorate([
    (0, tsoa_1.Security)("Bearer"),
    (0, tsoa_1.Get)("by-admin/{orderId}"),
    __param(0, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "getOrderByAdmin", null);
__decorate([
    (0, tsoa_1.Security)("Bearer"),
    (0, tsoa_1.Get)("users/{userId}"),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Query)()),
    __param(2, (0, tsoa_1.Query)()),
    __param(3, (0, tsoa_1.Query)()),
    __param(4, (0, tsoa_1.Query)()),
    __param(5, (0, tsoa_1.Query)()),
    __param(6, (0, tsoa_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number, String, String, String, Date]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "getOrdersByUserId", null);
OrderController = __decorate([
    (0, tsoa_1.Tags)("Orders"),
    (0, tsoa_1.Route)("order")
], OrderController);
exports.OrderController = OrderController;
