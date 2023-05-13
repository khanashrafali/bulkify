import { Router } from "express";
import {
  addressRoutes,
  adminRoutes,
  authRoutes,
  bankRoutes,
  cartRoutes,
  categoryRoutes,
  collectionRoutes,
  contentRoutes,
  couponRoutes,
  inventoryRoutes,
  orderRoutes,
  pricesRoutes,
  productRoutes,
  reviewRoutes,
  shipRocketRoutes,
  sliderRoutes,
  payoutRoutes,
  userRoutes,
  utilRoutes,
  vendorRoutes,
  erpApiRoutes,
  variantsRoutes,
  deleveryRoutes,
  roleRoutes,
  mainCatRoutes,
  hdfcRoutes,
  wishlistRoutes,
  brandRoutes,
  adsRoutes,
  badalDaloProductsRoutes,
  queriesRoutes,
  notificationRoutes,
} from ".";
import { errorCtrl } from "../controllers";
import { helper } from "../utils";

const router = Router();

router.use("/api/v1/auth", authRoutes);
router.use("/api/v1/categories", categoryRoutes);
router.use("/api/v1/vendors", vendorRoutes);
router.use("/api/v1/products", productRoutes);
router.use("/api/v1/collections", collectionRoutes);
router.use("/api/v1/utils", utilRoutes);
router.use("/api/v1/users", userRoutes);
router.use("/api/v1/cart", cartRoutes);
router.use("/api/v1/order", orderRoutes);
router.use("/api/v1/coupons", couponRoutes);
router.use("/api/v1/address", addressRoutes);
router.use("/api/v1/banks", bankRoutes);
router.use("/api/v1/slider", sliderRoutes);
router.use("/api/v1/review", reviewRoutes);
router.use("/api/v1/admins", adminRoutes);
router.use("/api/v1/ship-rocket", shipRocketRoutes);
router.use("/api/v1/payouts", payoutRoutes);
router.use("/api/v1/content", contentRoutes);
router.use("/api/v1/inventory", inventoryRoutes);
router.use("/api/v1/prices", pricesRoutes);
router.use("/api/v1/erp-api", erpApiRoutes);
router.use("/api/v1/variants", variantsRoutes);
router.use("/api/v1/delevery-address", deleveryRoutes);
router.use("/api/v1/roles", roleRoutes);
router.use("/api/v1/main-categories", mainCatRoutes);
router.use("/api/v1/hdfc", hdfcRoutes);
router.use("/api/v1/wishlist", wishlistRoutes);
router.use("/api/v1/brands", brandRoutes);
router.use("/api/v1/ads", adsRoutes);
router.use("/api/v1/DB-products", badalDaloProductsRoutes);
router.use("/api/v1/queries", queriesRoutes);
router.use("/api/v1/notifications", notificationRoutes);

router.use("/api/v1/*", errorCtrl.handle404);

// router.use("/panel/", (req, res) => {
//   res.status(200).sendFile(helper.buildPath("public", "panel", "index.html"));
// });

// router.use("/admin-panel/", (req, res) => {
//   res.status(200).sendFile(helper.buildPath("public", "admin-panel", "index.html"));
// });

// router.use("/vendor-panel/", (req, res) => {
//   res.status(200).sendFile(helper.buildPath("public", "vendor-panel", "index.html"));
// });

// router.use("/", (req, res) => {
//   res.status(200).sendFile(helper.buildPath("public", "user-panel", "index.html"));
// });

router.get("/", (req, res) => res.send("Hello from Express"));

router.use(errorCtrl.errorHandler);

export default router;
