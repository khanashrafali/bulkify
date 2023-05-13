import { NextFunction, Request, Response } from "express";
import { matchedData } from "express-validator";
import { productService } from "../services";
import { fileHandler, helper } from "../utils";
import { IRequest } from "../utils/interfaces";

/**
 * create product api
 */
const postAddProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    await productService.addProduct(req as IRequest, req.body);
    helper.buildResponse(res, "Product added sucessfully");
  } catch (error) {
    next(error);
  }
};

/**
 * update product api
 */
const putUpdateProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    await productService.updateProduct(req as IRequest, req.params.productIdOrSlug, req.body);
    helper.buildResponse(res, "Product updated sucessfully");
  } catch (error) {
    next(error);
  }
};

/**
 * create product api
 */
const postAddProductByAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    let result = await productService.addProductByAdmin(req as IRequest, req.body);
    helper.buildResponse(res, "Product added sucessfully", result);
  } catch (error) {
    next(error);
  }
};

/**
 * update product api
 */
const putUpdateProductByAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    await productService.updateProductByAdmin(req as IRequest, req.params.productIdOrSlug, req.body);
    helper.buildResponse(res, "Product updated sucessfully");
  } catch (error) {
    next(error);
  }
};

/**
 * delete product api
 */
const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    const result = await productService.deleteProduct(req as IRequest, req.params.productIdOrSlug);
    helper.buildResponse(res, "Product deleted sucessfully", result);
  } catch (error) {
    next(error);
  }
};

/**
 * get single product api
 */
const getProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    const result = await productService.getProduct(req.params.productIdOrSlug, req.query);
    helper.buildResponse(res, "Product fetched sucessfully", result);
  } catch (error) {
    next(error);
  }
};

/**
 * get single product by vendor api
 */
const getProductByVendor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    const result = await productService.getProductByVendor(req.params.productIdOrSlug);
    helper.buildResponse(res, "Product fetched sucessfully", result);
  } catch (error) {
    next(error);
  }
};

/**
 * get single product by admin api
 */
const getProductByAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    const result = await productService.getProductByAdmin(req.params.productIdOrSlug);
    helper.buildResponse(res, "Product fetched sucessfully", result);
  } catch (error) {
    next(error);
  }
};

/**
 * get product list api
 */
const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    const result = await productService.getProducts(req.query);
    helper.buildResponse(res, "Products fetched  sucessfully", result);
  } catch (error) {
    next(error);
  }
};

const searchProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    const result = await productService.searchProducts(req.body);
    helper.buildResponse(res, "Products fetched  sucessfully", result);
  } catch (error) {
    next(error);
  }
};

/**
 * get product list by admin api
 */
const getProductsByAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    const result = await productService.getProductsByAdmin(req as IRequest, req.query);
    helper.buildResponse(res, "Products fetched sucessfully", result);
  } catch (error) {
    next(error);
  }
};

/**
 * get product list by vendor api
 */
const getProductsByVendor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    const result = await productService.getProductsByVendor(req as IRequest, req.query);
    helper.buildResponse(res, "Products fetched sucessfully", result);
  } catch (error) {
    next(error);
  }
};

/**
 * get products by collection slug/id api
 */
const getProductsByCollection = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    const result = await productService.getProductsByCollection(req.params.collectionIdOrSlug, req.query);
    helper.buildResponse(res, "Products fetched sucessfully", result);
  } catch (error) {
    next(error);
  }
};

/**
 * update product status api
 */
const patchUpdateProductStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    const result = await productService.updateProductStatus(
      req as IRequest,
      req.params.productIdOrSlug,
      req.body.status
    );
    helper.buildResponse(res, "Products status updated sucessfully", result);
  } catch (error) {
    next(error);
  }
};

/**
 * update product feature status api
 */
const patchUpdateProductFeatureStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    const result = await productService.updateProductFeatureStatus(
      req as IRequest,
      req.params.productIdOrSlug,
      req.body.isFeatured
    );
    helper.buildResponse(res, "Products status updated sucessfully", result);
  } catch (error) {
    next(error);
  }
};

/**
 * delete product image api
 */
const deleteProductImage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    const result = await productService.deleteProductImage(req.params.productIdOrSlug, req.body.urls);
    helper.buildResponse(res, "Files deleted sucessfully", result);
  } catch (error) {
    next(error);
  }
};

/**
 * toggle vendor's product approval api
 */
const patchUpdateVendorProductApprovalStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    const result = await productService.updateVendorProductApprovalStatus(
      req as IRequest,
      req.params.productIdOrSlug,
      req.body.status
    );
    helper.buildResponse(res, "Product approval status updated sucessfully", result);
  } catch (error) {
    next(error);
  }
};

/**
 * get collections by product id api
 */
const getCollectionsByProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    const result = await productService.getCollectionsByProductId(req.params.productIdOrSlug);
    helper.buildResponse(res, "Collections fetched sucessfully", result);
  } catch (error) {
    next(error);
  }
};

// add bulk products through xlsx
const postUploadBulkProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    let result = await productService.uploadBulkProducts(req as IRequest, req.body.productOBJS);
    helper.buildResponse(res, "Products uploaded sucessfully", result);
  } catch (error) {
    if (req?.file) await fileHandler.deleteFile(req?.file?.path);
    next(error);
  }
};

const getHomePageProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    let result = await productService.fetchHomePageProducts(req.params.type, req.query);
    helper.buildResponse(res, "Fetched products successfully", result);
  } catch (error) {
    next(error);
  }
};

const fetchCompareProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    let result = await productService.fetchCompareProduct(req.query.from, req.query.to);
    helper.buildResponse(res, "Fetched products successfully", result);
  } catch (error) {
    next(error);
  }
};

const updateProductRating = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    let result = await productService.updateProductRating(req.params.productId, req.body.adminRating);
    helper.buildResponse(res, "Product rating set successfully", result);
  } catch (error) {
    next(error);
  }
};

const fetchTopSellingProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    let result = await productService.fetchTopSellingProduct();
    helper.buildResponse(res, "Fetched Product successfully", result);
  } catch (error) {
    next(error);
  }
};

const downloadProductFileSample = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    await productService.downloadProductFileSample(req.params.type, (path: any) => {
      res.download(path);
      // res.setHeader("Content-Type", "application/pdf");
      // res.attachment("filename.csv");
      // res.setHeader("Content-Type", "application/octet-stream");
      // res.setHeader("Content-Type", "application/octet-stream");
      // res.send(buffer);
    });
  } catch (error) {
    next(error);
  }
};

const downloadAllProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    let result = await productService.downloadAllProducts();
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=products.csv");
    res.status(200).end(result);
  } catch (error) {
    next(error);
  }
};

export default {
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
