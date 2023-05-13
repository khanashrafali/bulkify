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
exports.VendorController = void 0;
const tsoa_1 = require("tsoa");
const interfaces_1 = require("../../utils/interfaces");
let VendorController = class VendorController extends tsoa_1.Controller {
    /**
     * @summary Create new Vendor
     */
    createVendor(requestBody) {
        return __awaiter(this, void 0, void 0, function* () {
            return {};
        });
    }
    /**
     * @summary Create new Vendor
     */
    becameAVendor(requestBody) {
        return __awaiter(this, void 0, void 0, function* () {
            return {};
        });
    }
    /**
     * @summary Complete vendor profile
     */
    // @Security("Bearer")
    // @Post("complete-profile")
    // async completeVendorProfile(
    //   @FormField() businessName: string,
    //   @UploadedFile() profileImage: Express.Multer.File,
    //   @FormField() businessEmail: string,
    //   @FormField() mobileNumber: string,
    //   @FormField() gstNumber: string,
    //   @FormField() panNumber: string,
    //   @UploadedFile() addressProof: Express.Multer.File[],
    //   @FormField() status: string,
    //   @FormField() pickupLocation: string
    // ) {
    //   return {} as VendorResponse;
    // }
    /**
     * @summary Update Vendor info
     */
    updateVendor(vendorId, requestBody) {
        return __awaiter(this, void 0, void 0, function* () {
            return {};
        });
    }
    /**
     * @summary Update existing vendor active status
     */
    updateVendorStatus(vendorId, requestBody) {
        return __awaiter(this, void 0, void 0, function* () {
            return {};
        });
    }
    /**
     * @summary Update existing vendor approval status
     */
    updateVendorApprovalStatus(vendorId, requestBody) {
        return __awaiter(this, void 0, void 0, function* () {
            return {};
        });
    }
    /**
     * @summary Delete existing vendor
     */
    deleteVendor(vendorId) {
        return __awaiter(this, void 0, void 0, function* () {
            return {};
        });
    }
    /**
     * @summary fetch vednors by admin
     */
    getVendorsByAdmin(page, pageSize, textSearch, createdAt, isVendorProfileComplete, status, isApproved) {
        return __awaiter(this, void 0, void 0, function* () {
            return {};
        });
    }
    /**
     * @summary Delete vendor old image
     */
    deleteVendorImage(vendorId) {
        return __awaiter(this, void 0, void 0, function* () {
            return {};
        });
    }
    /**
     * @summary fetch vednors
     */
    getVendors(page, pageSize, textSearch, createdAt, isVendorProfileComplete, status, isApproved) {
        return __awaiter(this, void 0, void 0, function* () {
            return {};
        });
    }
    /**
     * @summary fetch single vendor details
     */
    getSingleVendor(vendorId) {
        return __awaiter(this, void 0, void 0, function* () {
            return {};
        });
    }
};
__decorate([
    (0, tsoa_1.Security)("Bearer"),
    (0, tsoa_1.Post)(""),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], VendorController.prototype, "createVendor", null);
__decorate([
    (0, tsoa_1.Security)("Bearer"),
    (0, tsoa_1.Post)("became-a-vendor"),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], VendorController.prototype, "becameAVendor", null);
__decorate([
    (0, tsoa_1.Security)("Bearer"),
    (0, tsoa_1.Put)("{vendorId}"),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], VendorController.prototype, "updateVendor", null);
__decorate([
    (0, tsoa_1.Security)("Bearer"),
    (0, tsoa_1.Patch)("{vendorId}"),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], VendorController.prototype, "updateVendorStatus", null);
__decorate([
    (0, tsoa_1.Security)("Bearer"),
    (0, tsoa_1.Patch)("approve/{vendorId}"),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], VendorController.prototype, "updateVendorApprovalStatus", null);
__decorate([
    (0, tsoa_1.Security)("Bearer"),
    (0, tsoa_1.Delete)("{vendorId}"),
    __param(0, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VendorController.prototype, "deleteVendor", null);
__decorate([
    (0, tsoa_1.Security)("Bearer"),
    (0, tsoa_1.Get)("by-admin"),
    __param(0, (0, tsoa_1.Query)()),
    __param(1, (0, tsoa_1.Query)()),
    __param(2, (0, tsoa_1.Query)()),
    __param(3, (0, tsoa_1.Query)()),
    __param(4, (0, tsoa_1.Query)()),
    __param(5, (0, tsoa_1.Query)()),
    __param(6, (0, tsoa_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, Date, Boolean, Boolean, String]),
    __metadata("design:returntype", Promise)
], VendorController.prototype, "getVendorsByAdmin", null);
__decorate([
    (0, tsoa_1.Security)("Bearer"),
    (0, tsoa_1.Delete)("images/{vendorId}"),
    __param(0, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VendorController.prototype, "deleteVendorImage", null);
__decorate([
    (0, tsoa_1.Get)(""),
    __param(0, (0, tsoa_1.Query)()),
    __param(1, (0, tsoa_1.Query)()),
    __param(2, (0, tsoa_1.Query)()),
    __param(3, (0, tsoa_1.Query)()),
    __param(4, (0, tsoa_1.Query)()),
    __param(5, (0, tsoa_1.Query)()),
    __param(6, (0, tsoa_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, Date, Boolean, Boolean, String]),
    __metadata("design:returntype", Promise)
], VendorController.prototype, "getVendors", null);
__decorate([
    (0, tsoa_1.Get)("/{vendorId}"),
    __param(0, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VendorController.prototype, "getSingleVendor", null);
VendorController = __decorate([
    (0, tsoa_1.Tags)("Vendors"),
    (0, tsoa_1.Route)("vendors")
], VendorController);
exports.VendorController = VendorController;
