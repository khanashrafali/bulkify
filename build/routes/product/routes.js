"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../../controllers");
const models_1 = require("../../models");
const utils_1 = require("../../utils");
const interfaces_1 = require("../../utils/interfaces");
const isAdminAuth_1 = require("../middlewares/isAdminAuth");
const isAuth_1 = require("../middlewares/isAuth");
const isVendorAuth_1 = require("../middlewares/isVendorAuth");
const validator_1 = __importDefault(require("./validator"));
const router = (0, express_1.Router)();
router.post("/uploads", utils_1.fileHandler.uploadFile().any(), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        let oldImages = [];
        if ((_a = req.body) === null || _a === void 0 ? void 0 : _a.oldImages) {
            oldImages = JSON.parse(((_b = req.body) === null || _b === void 0 ? void 0 : _b.oldImages) || []) || [];
        }
        utils_1.helper.buildResponse(res, "File Uploaded Successfully.");
        let product = yield models_1.productModel.findOne({ _id: req.body.productId });
        if (!product)
            throw utils_1.helper.buildError("no item found with this id", 404);
        let s3Images = yield utils_1.fileHandler.processImages(req.files);
        let images = s3Images.map((f) => f.variant);
        yield product.set({ images: [...oldImages, ...images] }).save();
    }
    catch (error) {
        next(error);
    }
}));
router.get("/top-selling", controllers_1.productCtrl.fetchTopSellingProduct);
router.get("/:productIdOrSlug/collections", validator_1.default.getProduct, controllers_1.productCtrl.getCollectionsByProduct);
router.get("/home-page/:type", validator_1.default.getHomePageProducts, controllers_1.productCtrl.getHomePageProducts);
router.get("/collection/:collectionIdOrSlug", validator_1.default.getProductsByCollection, controllers_1.productCtrl.getProductsByCollection);
router.post("/bulk-upload", isVendorAuth_1.isVendor, utils_1.fileHandler.uploadFile(["application/vnd.ms-excel", "text/csv"]).single("data"), validator_1.default.validateParseProducts, validator_1.default.postBulkUpload, controllers_1.productCtrl.postUploadBulkProducts);
router.post("/add/by-admin", isAdminAuth_1.isAdmin, validator_1.default.postAddProductByAdmin, controllers_1.productCtrl.postAddProductByAdmin);
router.put("/update/by-admin/:productIdOrSlug", isAdminAuth_1.isAdmin, validator_1.default.putUpdateProductByAdmin, controllers_1.productCtrl.putUpdateProductByAdmin);
router.post("/", isVendorAuth_1.isVendor, validator_1.default.postAddProduct, controllers_1.productCtrl.postAddProduct);
router.put("/:productIdOrSlug", isVendorAuth_1.isVendor, (0, isAuth_1.isAuth)([interfaces_1.UserRole.SUPER_ADMIN, interfaces_1.UserRole.VENDOR]), validator_1.default.putUpdateProduct, controllers_1.productCtrl.putUpdateProduct);
router.patch("/images/:productIdOrSlug", isVendorAuth_1.isVendor, validator_1.default.deleteProductImage, controllers_1.productCtrl.deleteProductImage);
router.patch("/approve/:productIdOrSlug", isAdminAuth_1.isAdmin, validator_1.default.patchUpdateVendorProductApprovalStatus, controllers_1.productCtrl.patchUpdateVendorProductApprovalStatus);
router.patch("/update-rating/:productId", isAdminAuth_1.isAdmin, controllers_1.productCtrl.updateProductRating);
router.patch("/featured/:productIdOrSlug", isAdminAuth_1.isAdmin, validator_1.default.patchUpdateProductFeatureStatus, controllers_1.productCtrl.patchUpdateProductFeatureStatus);
router.patch("/:productIdOrSlug", (0, isAuth_1.isAuth)([interfaces_1.UserRole.SUPER_ADMIN, interfaces_1.UserRole.VENDOR]), validator_1.default.patchUpdateProductStatus, controllers_1.productCtrl.patchUpdateProductStatus);
router.delete("/:productIdOrSlug", (0, isAuth_1.isAuth)([interfaces_1.UserRole.SUPER_ADMIN, interfaces_1.UserRole.VENDOR]), validator_1.default.getProduct, controllers_1.productCtrl.deleteProduct);
router.get("/compare", validator_1.default.fetchCompareProduct, controllers_1.productCtrl.fetchCompareProduct);
router.get("/download-products", validator_1.default.getProducts, controllers_1.productCtrl.downloadAllProducts);
router.get("/download-sample/:type", validator_1.default.downloadProductFileSample, controllers_1.productCtrl.downloadProductFileSample);
router.get("/by-admin", isAdminAuth_1.isAdmin, validator_1.default.getProducts, controllers_1.productCtrl.getProductsByAdmin);
router.get("/by-vendor", isVendorAuth_1.isVendor, validator_1.default.getProducts, controllers_1.productCtrl.getProductsByVendor);
router.post("/search", validator_1.default.searchProducts, controllers_1.productCtrl.searchProducts);
router.get("/:productIdOrSlug/by-admin", isAdminAuth_1.isAdmin, validator_1.default.getProduct, controllers_1.productCtrl.getProductByAdmin);
router.get("/:productIdOrSlug/by-vendor", isVendorAuth_1.isVendor, validator_1.default.getProduct, controllers_1.productCtrl.getProductByVendor);
router.get("/:productIdOrSlug", validator_1.default.getProduct, controllers_1.productCtrl.getProduct);
router.get("", validator_1.default.getProducts, controllers_1.productCtrl.getProducts);
exports.default = router;
