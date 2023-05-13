import { Router } from "express";
import sharp from "sharp";
import { productCtrl } from "../../controllers";
import { productModel } from "../../models";
import { fileHandler, helper } from "../../utils";
import { UserRole } from "../../utils/interfaces";
import { isAdmin } from "../middlewares/isAdminAuth";
import { isAuth } from "../middlewares/isAuth";
import { isVendor } from "../middlewares/isVendorAuth";
import validator from "./validator";

const router = Router();

router.post("/uploads", fileHandler.uploadFile().any(), async (req, res, next) => {
  try {
    let oldImages = [];
    if (req.body?.oldImages) {
      oldImages = JSON.parse(req.body?.oldImages || []) || [];
    }
    helper.buildResponse(res, "File Uploaded Successfully.");
    let product = await productModel.findOne({ _id: req.body.productId });
    if (!product) throw helper.buildError("no item found with this id", 404);
    let s3Images = await fileHandler.processImages(req.files as any[]);
    let images = s3Images.map((f) => f.variant);
    await product.set({ images: [...oldImages, ...images] }).save();
  } catch (error) {
    next(error);
  }
});

router.get("/top-selling", productCtrl.fetchTopSellingProduct);
router.get("/:productIdOrSlug/collections", validator.getProduct, productCtrl.getCollectionsByProduct);
router.get("/home-page/:type", validator.getHomePageProducts, productCtrl.getHomePageProducts);
router.get("/collection/:collectionIdOrSlug", validator.getProductsByCollection, productCtrl.getProductsByCollection);

router.post(
  "/bulk-upload",
  isVendor,
  fileHandler.uploadFile(["application/vnd.ms-excel", "text/csv"]).single("data"),
  validator.validateParseProducts,
  validator.postBulkUpload,
  productCtrl.postUploadBulkProducts
);

router.post("/add/by-admin", isAdmin, validator.postAddProductByAdmin, productCtrl.postAddProductByAdmin);
router.put(
  "/update/by-admin/:productIdOrSlug",
  isAdmin,
  validator.putUpdateProductByAdmin,
  productCtrl.putUpdateProductByAdmin
);
router.post("/", isVendor, validator.postAddProduct, productCtrl.postAddProduct);

router.put(
  "/:productIdOrSlug",
  isVendor,
  isAuth([UserRole.SUPER_ADMIN, UserRole.VENDOR]),
  validator.putUpdateProduct,
  productCtrl.putUpdateProduct
);

router.patch("/images/:productIdOrSlug", isVendor, validator.deleteProductImage, productCtrl.deleteProductImage);

router.patch(
  "/approve/:productIdOrSlug",
  isAdmin,
  validator.patchUpdateVendorProductApprovalStatus,
  productCtrl.patchUpdateVendorProductApprovalStatus
);

router.patch("/update-rating/:productId", isAdmin, productCtrl.updateProductRating);
router.patch(
  "/featured/:productIdOrSlug",
  isAdmin,
  validator.patchUpdateProductFeatureStatus,
  productCtrl.patchUpdateProductFeatureStatus
);
router.patch(
  "/:productIdOrSlug",
  isAuth([UserRole.SUPER_ADMIN, UserRole.VENDOR]),
  validator.patchUpdateProductStatus,
  productCtrl.patchUpdateProductStatus
);
router.delete(
  "/:productIdOrSlug",
  isAuth([UserRole.SUPER_ADMIN, UserRole.VENDOR]),
  validator.getProduct,
  productCtrl.deleteProduct
);
router.get("/compare", validator.fetchCompareProduct, productCtrl.fetchCompareProduct);
router.get("/download-products", validator.getProducts, productCtrl.downloadAllProducts);
router.get("/download-sample/:type", validator.downloadProductFileSample, productCtrl.downloadProductFileSample);
router.get("/by-admin", isAdmin, validator.getProducts, productCtrl.getProductsByAdmin);
router.get("/by-vendor", isVendor, validator.getProducts, productCtrl.getProductsByVendor);
router.post("/search", validator.searchProducts, productCtrl.searchProducts);
router.get("/:productIdOrSlug/by-admin", isAdmin, validator.getProduct, productCtrl.getProductByAdmin);
router.get("/:productIdOrSlug/by-vendor", isVendor, validator.getProduct, productCtrl.getProductByVendor);
router.get("/:productIdOrSlug", validator.getProduct, productCtrl.getProduct);
router.get("", validator.getProducts, productCtrl.getProducts);

export default router;
