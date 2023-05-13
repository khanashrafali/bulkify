"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationRoutes = exports.queriesRoutes = exports.badalDaloProductsRoutes = exports.adsRoutes = exports.brandRoutes = exports.wishlistRoutes = exports.hdfcRoutes = exports.mainCatRoutes = exports.roleRoutes = exports.deleveryRoutes = exports.variantsRoutes = exports.erpApiRoutes = exports.pricesRoutes = exports.inventoryRoutes = exports.bankRoutes = exports.contentRoutes = exports.payoutRoutes = exports.shipRocketRoutes = exports.adminRoutes = exports.reviewRoutes = exports.sliderRoutes = exports.addressRoutes = exports.couponRoutes = exports.orderRoutes = exports.cartRoutes = exports.userRoutes = exports.utilRoutes = exports.collectionRoutes = exports.productRoutes = exports.vendorRoutes = exports.categoryRoutes = exports.authRoutes = void 0;
const routes_1 = __importDefault(require("./auth/routes"));
exports.authRoutes = routes_1.default;
const routes_2 = __importDefault(require("./category/routes"));
exports.categoryRoutes = routes_2.default;
const routes_3 = __importDefault(require("./vendor/routes"));
exports.vendorRoutes = routes_3.default;
const routes_4 = __importDefault(require("./product/routes"));
exports.productRoutes = routes_4.default;
const routes_5 = __importDefault(require("./collection/routes"));
exports.collectionRoutes = routes_5.default;
const routes_6 = __importDefault(require("./util/routes"));
exports.utilRoutes = routes_6.default;
const routes_7 = __importDefault(require("./user/routes"));
exports.userRoutes = routes_7.default;
const routes_8 = __importDefault(require("./cart/routes"));
exports.cartRoutes = routes_8.default;
const routes_9 = __importDefault(require("./order/routes"));
exports.orderRoutes = routes_9.default;
const routes_10 = __importDefault(require("./coupon/routes"));
exports.couponRoutes = routes_10.default;
const routes_11 = __importDefault(require("./address/routes"));
exports.addressRoutes = routes_11.default;
const routes_12 = __importDefault(require("./slider/routes"));
exports.sliderRoutes = routes_12.default;
const routes_13 = __importDefault(require("./review/routes"));
exports.reviewRoutes = routes_13.default;
const routes_14 = __importDefault(require("./admin/routes"));
exports.adminRoutes = routes_14.default;
const routes_15 = __importDefault(require("./shipRocket/routes"));
exports.shipRocketRoutes = routes_15.default;
const routes_16 = __importDefault(require("./payout/routes"));
exports.payoutRoutes = routes_16.default;
const routes_17 = __importDefault(require("./content/routes"));
exports.contentRoutes = routes_17.default;
const routes_18 = __importDefault(require("./bank/routes"));
exports.bankRoutes = routes_18.default;
const routes_19 = __importDefault(require("./inventory/routes"));
exports.inventoryRoutes = routes_19.default;
const routes_20 = __importDefault(require("./prices/routes"));
exports.pricesRoutes = routes_20.default;
const routes_21 = __importDefault(require("./erp-apis/routes"));
exports.erpApiRoutes = routes_21.default;
const routes_22 = __importDefault(require("./variants/routes"));
exports.variantsRoutes = routes_22.default;
const routes_23 = __importDefault(require("./delevery-address/routes"));
exports.deleveryRoutes = routes_23.default;
const routes_24 = __importDefault(require("./roles/routes"));
exports.roleRoutes = routes_24.default;
const routes_25 = __importDefault(require("./main-category/routes"));
exports.mainCatRoutes = routes_25.default;
const routes_26 = __importDefault(require("./hdfc/routes"));
exports.hdfcRoutes = routes_26.default;
const routes_27 = __importDefault(require("./wishlist/routes"));
exports.wishlistRoutes = routes_27.default;
const routes_28 = __importDefault(require("./brand/routes"));
exports.brandRoutes = routes_28.default;
const routes_29 = __importDefault(require("./ads/routes"));
exports.adsRoutes = routes_29.default;
const routes_30 = __importDefault(require("./badaldalo-products/routes"));
exports.badalDaloProductsRoutes = routes_30.default;
const routes_31 = __importDefault(require("./queries/routes"));
exports.queriesRoutes = routes_31.default;
const routes_32 = __importDefault(require("./notification/routes"));
exports.notificationRoutes = routes_32.default;