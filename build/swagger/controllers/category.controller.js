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
exports.CategoryController = void 0;
const tsoa_1 = require("tsoa");
let CategoryController = class CategoryController extends tsoa_1.Controller {
    /**
     * @summary fetch categories
     */
    getMainCategories(page, pageSize, status, createdAt) {
        return __awaiter(this, void 0, void 0, function* () {
            return {};
        });
    }
    /**
     * @summary fetch single category details
     */
    getMainCategoryById(categoryId) {
        return __awaiter(this, void 0, void 0, function* () {
            return {};
        });
    }
    /**
     * @summary fetch categories by admin
     */
    getMainCategoriesByAdmin(page, pageSize, status, createdAt) {
        return __awaiter(this, void 0, void 0, function* () {
            return {};
        });
    }
    /**
     * @summary Create new category
     */
    createMainCategory(requestBody) {
        return __awaiter(this, void 0, void 0, function* () {
            return {};
        });
    }
    /**
     * @summary Update existing category
     */
    updateMainCategory(categoryId, requestBody) {
        return __awaiter(this, void 0, void 0, function* () {
            return {};
        });
    }
    /**
     * @summary Update existing category active status
     */
    updateMainCategoryStatus(categoryId, requestBody) {
        return __awaiter(this, void 0, void 0, function* () {
            return {};
        });
    }
    /**
     * @summary Delete existing category
     */
    deleteMainCategoryStatus(categoryId) {
        return __awaiter(this, void 0, void 0, function* () {
            return {};
        });
    }
    /**
     * @summary create sub category by admin
     */
    createSubCategory(mainCategoryId, requestBody) {
        return __awaiter(this, void 0, void 0, function* () {
            return {};
        });
    }
    /**
     * @summary update sub category by admin
     */
    updateSubCategory(mainCategoryId, requestBody) {
        return __awaiter(this, void 0, void 0, function* () {
            return {};
        });
    }
    /**
     * @summary fetch sub categories by admin
     */
    getSubCategoriesByAdmin(mainCategoryId, page, pageSize) {
        return __awaiter(this, void 0, void 0, function* () {
            return {};
        });
    }
    /**
     * @summary delete sub category
     */
    deleteSubCategory(subCategoryId) {
        return __awaiter(this, void 0, void 0, function* () {
            return {};
        });
    }
    /**
     * @summary fetch sub categories
     */
    getSubCategories(mainCategoryId, page, pageSize) {
        return __awaiter(this, void 0, void 0, function* () {
            return {};
        });
    }
    /**
     * @summary fetch sub category
     */
    getSubCategory(subCategoryId) {
        return __awaiter(this, void 0, void 0, function* () {
            return {};
        });
    }
};
__decorate([
    (0, tsoa_1.Get)(""),
    __param(0, (0, tsoa_1.Query)()),
    __param(1, (0, tsoa_1.Query)()),
    __param(2, (0, tsoa_1.Query)()),
    __param(3, (0, tsoa_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Boolean, Date]),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "getMainCategories", null);
__decorate([
    (0, tsoa_1.Get)("/{categoryId}"),
    __param(0, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "getMainCategoryById", null);
__decorate([
    (0, tsoa_1.Security)("Bearer"),
    (0, tsoa_1.Get)("by-admin"),
    __param(0, (0, tsoa_1.Query)()),
    __param(1, (0, tsoa_1.Query)()),
    __param(2, (0, tsoa_1.Query)()),
    __param(3, (0, tsoa_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Boolean, Date]),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "getMainCategoriesByAdmin", null);
__decorate([
    (0, tsoa_1.Security)("Bearer"),
    (0, tsoa_1.Post)(""),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "createMainCategory", null);
__decorate([
    (0, tsoa_1.Security)("Bearer"),
    (0, tsoa_1.Put)("{categoryId}"),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "updateMainCategory", null);
__decorate([
    (0, tsoa_1.Security)("Bearer"),
    (0, tsoa_1.Patch)("{categoryId}"),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "updateMainCategoryStatus", null);
__decorate([
    (0, tsoa_1.Security)("Bearer"),
    (0, tsoa_1.Delete)("{categoryId}"),
    __param(0, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "deleteMainCategoryStatus", null);
__decorate([
    (0, tsoa_1.Security)("Bearer"),
    (0, tsoa_1.Post)("sub-categories/{mainCategoryId}"),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "createSubCategory", null);
__decorate([
    (0, tsoa_1.Security)("Bearer"),
    (0, tsoa_1.Put)("sub-categories/{mainCategoryId}"),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "updateSubCategory", null);
__decorate([
    (0, tsoa_1.Security)("Bearer"),
    (0, tsoa_1.Get)("sub-categories/list/by-admin/{mainCategoryId}"),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Query)()),
    __param(2, (0, tsoa_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "getSubCategoriesByAdmin", null);
__decorate([
    (0, tsoa_1.Security)("Bearer"),
    (0, tsoa_1.Delete)("sub-categories/{subCategoryId}}"),
    __param(0, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "deleteSubCategory", null);
__decorate([
    (0, tsoa_1.Get)("sub-categories/list/{mainCategoryId}"),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Query)()),
    __param(2, (0, tsoa_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "getSubCategories", null);
__decorate([
    (0, tsoa_1.Get)("sub-categories/{subCategoryId}}"),
    __param(0, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "getSubCategory", null);
CategoryController = __decorate([
    (0, tsoa_1.Tags)("Category"),
    (0, tsoa_1.Route)("categories")
], CategoryController);
exports.CategoryController = CategoryController;
