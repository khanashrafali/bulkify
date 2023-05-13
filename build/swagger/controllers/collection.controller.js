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
exports.CollectionController = void 0;
const tsoa_1 = require("tsoa");
let CollectionController = class CollectionController extends tsoa_1.Controller {
    /**
     * @summary Create new collection
     */
    createCollection(requestBody) {
        return __awaiter(this, void 0, void 0, function* () {
            return {};
        });
    }
    /**
     * @summary Update existing collection
     */
    updateCollection(collectionId, requestBody) {
        return __awaiter(this, void 0, void 0, function* () {
            return {};
        });
    }
    /**
     * @summary Update existing collection active status
     */
    updateCollectionStatus(collectionId, requestBody) {
        return __awaiter(this, void 0, void 0, function* () {
            return {};
        });
    }
    /**
     * @summary Update existing collection featured status
     */
    updateCollectionFeaturedStatus(collectionId, requestBody) {
        return __awaiter(this, void 0, void 0, function* () {
            return {};
        });
    }
    /**
     * @summary Delete existing collection
     */
    deleteCollection(collectionId) {
        return __awaiter(this, void 0, void 0, function* () {
            return {};
        });
    }
    /**
     * @summary fetch collections by admin
     */
    getCollectionsByAdmin(page, pageSize, status, createdAt, isFeatured) {
        return __awaiter(this, void 0, void 0, function* () {
            return {};
        });
    }
    /**
     * @summary fetch collections
     */
    getCollections(page, pageSize, status, createdAt, isFeatured) {
        return __awaiter(this, void 0, void 0, function* () {
            return {};
        });
    }
    /**
     * @summary fetch single collection details
     */
    getCollectionById(collectionId) {
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
], CollectionController.prototype, "createCollection", null);
__decorate([
    (0, tsoa_1.Security)("Bearer"),
    (0, tsoa_1.Put)("{collectionId}"),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CollectionController.prototype, "updateCollection", null);
__decorate([
    (0, tsoa_1.Security)("Bearer"),
    (0, tsoa_1.Patch)("{collectionId}"),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CollectionController.prototype, "updateCollectionStatus", null);
__decorate([
    (0, tsoa_1.Security)("Bearer"),
    (0, tsoa_1.Patch)("featured/{collectionId}"),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CollectionController.prototype, "updateCollectionFeaturedStatus", null);
__decorate([
    (0, tsoa_1.Security)("Bearer"),
    (0, tsoa_1.Delete)("{collectionId}"),
    __param(0, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CollectionController.prototype, "deleteCollection", null);
__decorate([
    (0, tsoa_1.Security)("Bearer"),
    (0, tsoa_1.Get)("by-admin"),
    __param(0, (0, tsoa_1.Query)()),
    __param(1, (0, tsoa_1.Query)()),
    __param(2, (0, tsoa_1.Query)()),
    __param(3, (0, tsoa_1.Query)()),
    __param(4, (0, tsoa_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Boolean, Date, Boolean]),
    __metadata("design:returntype", Promise)
], CollectionController.prototype, "getCollectionsByAdmin", null);
__decorate([
    (0, tsoa_1.Get)(""),
    __param(0, (0, tsoa_1.Query)()),
    __param(1, (0, tsoa_1.Query)()),
    __param(2, (0, tsoa_1.Query)()),
    __param(3, (0, tsoa_1.Query)()),
    __param(4, (0, tsoa_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Boolean, Date, Boolean]),
    __metadata("design:returntype", Promise)
], CollectionController.prototype, "getCollections", null);
__decorate([
    (0, tsoa_1.Get)("/{collectionId}"),
    __param(0, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CollectionController.prototype, "getCollectionById", null);
CollectionController = __decorate([
    (0, tsoa_1.Tags)("Collections"),
    (0, tsoa_1.Route)("collections")
], CollectionController);
exports.CollectionController = CollectionController;
