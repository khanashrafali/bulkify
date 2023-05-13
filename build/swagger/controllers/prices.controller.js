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
exports.PriceController = void 0;
const tsoa_1 = require("tsoa");
let PriceController = class PriceController extends tsoa_1.Controller {
    /**
     * @summary Add Price
     */
    addPrice(requestBody) {
        return __awaiter(this, void 0, void 0, function* () {
            return {};
        });
    }
    /**
     * @summary Update Price
     */
    updatePrice(priceId, requestBody) {
        return __awaiter(this, void 0, void 0, function* () {
            return {};
        });
    }
    /**
     * @summary fetch Pricees
     */
    getPricees() {
        return __awaiter(this, void 0, void 0, function* () {
            return {};
        });
    }
    /**
     * @summary fetch Price By id
     */
    getPrice(priceId) {
        return __awaiter(this, void 0, void 0, function* () {
            return {};
        });
    }
    /**
     * @summary Delete Price
     */
    deletePrice(priceId) {
        return __awaiter(this, void 0, void 0, function* () {
            return {};
        });
    }
};
__decorate([
    (0, tsoa_1.Post)(""),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PriceController.prototype, "addPrice", null);
__decorate([
    (0, tsoa_1.Put)("{priceId}"),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PriceController.prototype, "updatePrice", null);
__decorate([
    (0, tsoa_1.Get)(""),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PriceController.prototype, "getPricees", null);
__decorate([
    (0, tsoa_1.Get)("{priceId}"),
    __param(0, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PriceController.prototype, "getPrice", null);
__decorate([
    (0, tsoa_1.Delete)("{priceId}"),
    __param(0, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PriceController.prototype, "deletePrice", null);
PriceController = __decorate([
    (0, tsoa_1.Tags)("Prices"),
    (0, tsoa_1.Route)("prices"),
    (0, tsoa_1.Security)("Bearer")
], PriceController);
exports.PriceController = PriceController;
