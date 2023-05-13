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
exports.CouponController = void 0;
const tsoa_1 = require("tsoa");
let CouponController = class CouponController extends tsoa_1.Controller {
    /**
     * @summary Add Coupon
     */
    addCoupon(requestBody) {
        return __awaiter(this, void 0, void 0, function* () {
            return {};
        });
    }
    /**
     * @summary Update coupon
     */
    updateCoupon(couponId, requestBody) {
        return __awaiter(this, void 0, void 0, function* () {
            return {};
        });
    }
    /**
     * @summary update coupon status
     */
    updateCouponStatus(requestBody) {
        return __awaiter(this, void 0, void 0, function* () {
            return {};
        });
    }
    /**
     * @summary fetch coupon By id
     */
    getCoupon(couponId) {
        return __awaiter(this, void 0, void 0, function* () {
            return {};
        });
    }
    /**
     * @summary Delete coupon
     */
    deleteCoupon(couponId) {
        return __awaiter(this, void 0, void 0, function* () {
            return {};
        });
    }
    /**
     * @summary fetch coupons
     */
    getCoupons(page, pageSize, status, createdAt) {
        return __awaiter(this, void 0, void 0, function* () {
            return {};
        });
    }
    /**
     * @summary apply coupon
     */
    applyCoupon(requestBody) {
        return __awaiter(this, void 0, void 0, function* () {
            return {};
        });
    }
    /**
     * @summary fetch coupons By users
     */
    getCouponsByUser(page, pageSize, status, createdAt) {
        return __awaiter(this, void 0, void 0, function* () {
            return {};
        });
    }
};
__decorate([
    tsoa_1.Security("Bearer"),
    tsoa_1.Post(""),
    __param(0, tsoa_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CouponController.prototype, "addCoupon", null);
__decorate([
    tsoa_1.Security("Bearer"),
    tsoa_1.Put("{couponId}"),
    __param(0, tsoa_1.Path()),
    __param(1, tsoa_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CouponController.prototype, "updateCoupon", null);
__decorate([
    tsoa_1.Security("Bearer"),
    tsoa_1.Patch("{couponId}"),
    __param(0, tsoa_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CouponController.prototype, "updateCouponStatus", null);
__decorate([
    tsoa_1.Security("Bearer"),
    tsoa_1.Get("{couponId}"),
    __param(0, tsoa_1.Path()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CouponController.prototype, "getCoupon", null);
__decorate([
    tsoa_1.Security("Bearer"),
    tsoa_1.Delete("{couponId}"),
    __param(0, tsoa_1.Path()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CouponController.prototype, "deleteCoupon", null);
__decorate([
    tsoa_1.Security("Bearer"),
    tsoa_1.Get(""),
    __param(0, tsoa_1.Query()),
    __param(1, tsoa_1.Query()),
    __param(2, tsoa_1.Query()),
    __param(3, tsoa_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Boolean, Date]),
    __metadata("design:returntype", Promise)
], CouponController.prototype, "getCoupons", null);
__decorate([
    tsoa_1.Post("apply"),
    __param(0, tsoa_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CouponController.prototype, "applyCoupon", null);
__decorate([
    tsoa_1.Get("applicable/list"),
    __param(0, tsoa_1.Query()),
    __param(1, tsoa_1.Query()),
    __param(2, tsoa_1.Query()),
    __param(3, tsoa_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Boolean, Date]),
    __metadata("design:returntype", Promise)
], CouponController.prototype, "getCouponsByUser", null);
CouponController = __decorate([
    tsoa_1.Tags("Coupons"),
    tsoa_1.Route("coupons")
], CouponController);
exports.CouponController = CouponController;
