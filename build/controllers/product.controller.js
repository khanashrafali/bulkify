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
Object.defineProperty(exports, "__esModule", { value: true });
const services_1 = require("../services");
const utils_1 = require("../utils");
/**
 * create product api
 */
const postAddProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        yield services_1.productService.addProduct(req, req.body);
        utils_1.helper.buildResponse(res, "Product added sucessfully");
    }
    catch (error) {
        next(error);
    }
});
/**
 * update product api
 */
const putUpdateProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        yield services_1.productService.updateProduct(req, req.params.productIdOrSlug, req.body);
        utils_1.helper.buildResponse(res, "Product updated sucessfully");
    }
    catch (error) {
        next(error);
    }
});
/**
 * create product api
 */
const postAddProductByAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        let result = yield services_1.productService.addProductByAdmin(req, req.body);
        utils_1.helper.buildResponse(res, "Product added sucessfully", result);
    }
    catch (error) {
        next(error);
    }
});
/**
 * update product api
 */
const putUpdateProductByAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        yield services_1.productService.updateProductByAdmin(req, req.params.productIdOrSlug, req.body);
        utils_1.helper.buildResponse(res, "Product updated sucessfully");
    }
    catch (error) {
        next(error);
    }
});
/**
 * delete product api
 */
const deleteProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        const result = yield services_1.productService.deleteProduct(req, req.params.productIdOrSlug);
        utils_1.helper.buildResponse(res, "Product deleted sucessfully", result);
    }
    catch (error) {
        next(error);
    }
});
/**
 * get single product api
 */
const getProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        const result = yield services_1.productService.getProduct(req.params.productIdOrSlug, req.query);
        utils_1.helper.buildResponse(res, "Product fetched sucessfully", result);
    }
    catch (error) {
        next(error);
    }
});
/**
 * get single product by vendor api
 */
const getProductByVendor = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        const result = yield services_1.productService.getProductByVendor(req.params.productIdOrSlug);
        utils_1.helper.buildResponse(res, "Product fetched sucessfully", result);
    }
    catch (error) {
        next(error);
    }
});
/**
 * get single product by admin api
 */
const getProductByAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        const result = yield services_1.productService.getProductByAdmin(req.params.productIdOrSlug);
        utils_1.helper.buildResponse(res, "Product fetched sucessfully", result);
    }
    catch (error) {
        next(error);
    }
});
/**
 * get product list api
 */
const getProducts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        const result = yield services_1.productService.getProducts(req.query);
        utils_1.helper.buildResponse(res, "Products fetched  sucessfully", result);
    }
    catch (error) {
        next(error);
    }
});
const searchProducts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        const result = yield services_1.productService.searchProducts(req.body);
        utils_1.helper.buildResponse(res, "Products fetched  sucessfully", result);
    }
    catch (error) {
        next(error);
    }
});
/**
 * get product list by admin api
 */
const getProductsByAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        const result = yield services_1.productService.getProductsByAdmin(req, req.query);
        utils_1.helper.buildResponse(res, "Products fetched sucessfully", result);
    }
    catch (error) {
        next(error);
    }
});
/**
 * get product list by vendor api
 */
const getProductsByVendor = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        const result = yield services_1.productService.getProductsByVendor(req, req.query);
        utils_1.helper.buildResponse(res, "Products fetched sucessfully", result);
    }
    catch (error) {
        next(error);
    }
});
/**
 * get products by collection slug/id api
 */
const getProductsByCollection = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        const result = yield services_1.productService.getProductsByCollection(req.params.collectionIdOrSlug, req.query);
        utils_1.helper.buildResponse(res, "Products fetched sucessfully", result);
    }
    catch (error) {
        next(error);
    }
});
/**
 * update product status api
 */
const patchUpdateProductStatus = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        const result = yield services_1.productService.updateProductStatus(req, req.params.productIdOrSlug, req.body.status);
        utils_1.helper.buildResponse(res, "Products status updated sucessfully", result);
    }
    catch (error) {
        next(error);
    }
});
/**
 * update product feature status api
 */
const patchUpdateProductFeatureStatus = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        const result = yield services_1.productService.updateProductFeatureStatus(req, req.params.productIdOrSlug, req.body.isFeatured);
        utils_1.helper.buildResponse(res, "Products status updated sucessfully", result);
    }
    catch (error) {
        next(error);
    }
});
/**
 * delete product image api
 */
const deleteProductImage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        const result = yield services_1.productService.deleteProductImage(req.params.productIdOrSlug, req.body.urls);
        utils_1.helper.buildResponse(res, "Files deleted sucessfully", result);
    }
    catch (error) {
        next(error);
    }
});
/**
 * toggle vendor's product approval api
 */
const patchUpdateVendorProductApprovalStatus = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        const result = yield services_1.productService.updateVendorProductApprovalStatus(req, req.params.productIdOrSlug, req.body.status);
        utils_1.helper.buildResponse(res, "Product approval status updated sucessfully", result);
    }
    catch (error) {
        next(error);
    }
});
/**
 * get collections by product id api
 */
const getCollectionsByProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        const result = yield services_1.productService.getCollectionsByProductId(req.params.productIdOrSlug);
        utils_1.helper.buildResponse(res, "Collections fetched sucessfully", result);
    }
    catch (error) {
        next(error);
    }
});
// add bulk products through xlsx
const postUploadBulkProducts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        utils_1.helper.handlePayloadError(req);
        let result = yield services_1.productService.uploadBulkProducts(req, req.body.productOBJS);
        utils_1.helper.buildResponse(res, "Products uploaded sucessfully", result);
    }
    catch (error) {
        if (req === null || req === void 0 ? void 0 : req.file)
            yield utils_1.fileHandler.deleteFile((_a = req === null || req === void 0 ? void 0 : req.file) === null || _a === void 0 ? void 0 : _a.path);
        next(error);
    }
});
const getHomePageProducts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        let result = yield services_1.productService.fetchHomePageProducts(req.params.type, req.query);
        utils_1.helper.buildResponse(res, "Fetched products successfully", result);
    }
    catch (error) {
        next(error);
    }
});
const fetchCompareProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        let result = yield services_1.productService.fetchCompareProduct(req.query.from, req.query.to);
        utils_1.helper.buildResponse(res, "Fetched products successfully", result);
    }
    catch (error) {
        next(error);
    }
});
const updateProductRating = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        let result = yield services_1.productService.updateProductRating(req.params.productId, req.body.adminRating);
        utils_1.helper.buildResponse(res, "Product rating set successfully", result);
    }
    catch (error) {
        next(error);
    }
});
const fetchTopSellingProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        let result = yield services_1.productService.fetchTopSellingProduct();
        utils_1.helper.buildResponse(res, "Fetched Product successfully", result);
    }
    catch (error) {
        next(error);
    }
});
const downloadProductFileSample = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        yield services_1.productService.downloadProductFileSample(req.params.type, (path) => {
            res.download(path);
            // res.setHeader("Content-Type", "application/pdf");
            // res.attachment("filename.csv");
            // res.setHeader("Content-Type", "application/octet-stream");
            // res.setHeader("Content-Type", "application/octet-stream");
            // res.send(buffer);
        });
    }
    catch (error) {
        next(error);
    }
});
const downloadAllProducts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        let result = yield services_1.productService.downloadAllProducts();
        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", "attachment; filename=products.csv");
        res.status(200).end(result);
    }
    catch (error) {
        next(error);
    }
});
exports.default = {
    postAddProduct,
    putUpdateProduct,
    deleteProduct,
    getProduct,
    getProducts,
    searchProducts,
    getProductsByAdmin,
    getProductsByVendor,
    getProductsByCollection,
    patchUpdateProductStatus,
    deleteProductImage,
    patchUpdateVendorProductApprovalStatus,
    getProductByAdmin,
    getProductByVendor,
    postUploadBulkProducts,
    getCollectionsByProduct,
    patchUpdateProductFeatureStatus,
    getHomePageProducts,
    postAddProductByAdmin,
    putUpdateProductByAdmin,
    fetchCompareProduct,
    updateProductRating,
    fetchTopSellingProduct,
    downloadProductFileSample,
    downloadAllProducts,
};
