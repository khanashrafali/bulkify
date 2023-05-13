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
exports.TransactionController = void 0;
const tsoa_1 = require("tsoa");
let TransactionController = class TransactionController extends tsoa_1.Controller {
    /**
     * @summary fetch all transactions
     */
    getAllTransactions(page, pageSize, textSearch) {
        return __awaiter(this, void 0, void 0, function* () {
            return {};
        });
    }
    /**
     * @summary fetch all vendors with balances
     */
    getAllvendors(page, pageSize, textSearch) {
        return __awaiter(this, void 0, void 0, function* () {
            return [];
        });
    }
    /**
     * @summary get transaction by vendor id
     */
    getTxByVendorId(vendorId, page, pageSize, textSearch) {
        return __awaiter(this, void 0, void 0, function* () {
            return {};
        });
    }
    /**
     * @summary get balance
     */
    getbalance() {
        return __awaiter(this, void 0, void 0, function* () {
            return {};
        });
    }
    /**
     * @summary get payout by id
     */
    getPayout(payoutId) {
        return __awaiter(this, void 0, void 0, function* () {
            return {};
        });
    }
    /**
     * @summary get payouts
     */
    getPayouts(page, pageSize, textSearch) {
        return __awaiter(this, void 0, void 0, function* () {
            return {};
        });
    }
    /**
     * @summary create payout
     */
    createPayout(requestBody) {
        return __awaiter(this, void 0, void 0, function* () {
            return {};
        });
    }
};
__decorate([
    tsoa_1.Get(""),
    __param(0, tsoa_1.Query()),
    __param(1, tsoa_1.Query()),
    __param(2, tsoa_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String]),
    __metadata("design:returntype", Promise)
], TransactionController.prototype, "getAllTransactions", null);
__decorate([
    tsoa_1.Get("/vendors"),
    __param(0, tsoa_1.Query()),
    __param(1, tsoa_1.Query()),
    __param(2, tsoa_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String]),
    __metadata("design:returntype", Promise)
], TransactionController.prototype, "getAllvendors", null);
__decorate([
    tsoa_1.Get("/vendors/{vendorId}"),
    __param(0, tsoa_1.Path()),
    __param(1, tsoa_1.Query()),
    __param(2, tsoa_1.Query()),
    __param(3, tsoa_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number, String]),
    __metadata("design:returntype", Promise)
], TransactionController.prototype, "getTxByVendorId", null);
__decorate([
    tsoa_1.Get("/balance"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TransactionController.prototype, "getbalance", null);
__decorate([
    tsoa_1.Get("/payouts/{payoutId}"),
    __param(0, tsoa_1.Path()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TransactionController.prototype, "getPayout", null);
__decorate([
    tsoa_1.Get("/payouts"),
    __param(0, tsoa_1.Query()),
    __param(1, tsoa_1.Query()),
    __param(2, tsoa_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String]),
    __metadata("design:returntype", Promise)
], TransactionController.prototype, "getPayouts", null);
__decorate([
    tsoa_1.Post("/payouts"),
    __param(0, tsoa_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TransactionController.prototype, "createPayout", null);
TransactionController = __decorate([
    tsoa_1.Tags("Transaction"),
    tsoa_1.Route("transactions"),
    tsoa_1.Security("Bearer")
], TransactionController);
exports.TransactionController = TransactionController;
