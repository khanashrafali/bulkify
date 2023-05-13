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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const moment_1 = __importDefault(require("moment"));
const _1 = require(".");
const models_1 = require("../models");
const utils_1 = require("../utils");
const interfaces_1 = require("../utils/interfaces");
utils_1.helper.loadEnvFile();
/**
 * get app users handler
 */
const getUsers = (queryParams) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, e_1, _b, _c;
    var _d;
    try {
        let condition = {};
        const pageInfo = utils_1.helper.checkPagination(queryParams);
        if ((_d = queryParams.textSearch) === null || _d === void 0 ? void 0 : _d.length) {
            condition["$or"] = [
                { name: { $regex: utils_1.helper.regxEscape(queryParams.textSearch), $options: "i" } },
                { email: { $regex: utils_1.helper.regxEscape(queryParams.textSearch), $options: "i" } },
                { mobileNumber: { $regex: utils_1.helper.regxEscape(queryParams.textSearch), $options: "i" } },
            ];
        }
        if ("createdAt" in queryParams)
            condition.date = queryParams.createdAt;
        const count = yield models_1.userModel.countDocuments(condition);
        let mongoQuery = models_1.userModel.find(condition).sort({ createdAt: -1 }).lean();
        let docs = [];
        if (pageInfo)
            docs = yield mongoQuery.skip(pageInfo.skip).limit(pageInfo.pageSize);
        else
            docs = yield models_1.userModel.find(condition).sort({ createdAt: -1 });
        let items = [];
        try {
            for (var _e = true, docs_1 = __asyncValues(docs), docs_1_1; docs_1_1 = yield docs_1.next(), _a = docs_1_1.done, !_a;) {
                _c = docs_1_1.value;
                _e = false;
                try {
                    let user = _c;
                    items.push(Object.assign(Object.assign({}, user), { orderCount: yield models_1.orderModel.countDocuments({ user: user._id }) }));
                }
                finally {
                    _e = true;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_e && !_a && (_b = docs_1.return)) yield _b.call(docs_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return utils_1.helper.makePaginatedData(items, count, pageInfo);
    }
    catch (error) {
        throw error;
    }
});
/**
 * get dashboard module count
 */
const adminDashboradInfo = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let userToJson = req.user.toJSON();
        let orderConditions = { currentOrderStatus: { $ne: interfaces_1.OrderStatus.PENDING } };
        let productConditions = {};
        // if (userToJson.role == UserRole.VENDOR) {
        //   productConditions.vendor = userToJson._id;
        //   orderConditions.vendor = req.user._id;
        // } else {
        // }
        // let balance = await transactionService.getBalance(userToJson._id, userToJson.role);
        let balance = 0;
        let productsCount = yield models_1.productModel.countDocuments(productConditions);
        let totalOrderCount = yield _1.shiprocketService.getOrders(null);
        // let cancelOrderCount = await orderModel.countDocuments({
        //   ...orderConditions,
        //   currentOrderStatus: OrderStatus.CANCELLED,
        // });
        // let returnOrderCount = await orderModel.countDocuments({
        //   ...orderConditions,
        //   currentOrderStatus: OrderStatus.RETURNED,
        // });
        // if (userToJson.role == UserRole.VENDOR) return { ordersCount, productsCount, ...balance };
        let usersCount = yield models_1.userModel.countDocuments({ deleted: false });
        let categoriesCount = yield models_1.categoryModel.countDocuments({ deleted: false });
        // let collectionsCount = await collectionModel.countDocuments({ deleted: false });
        // let couponsCount = await couponModel.countDocuments({ deleted: false });
        // let vendorsCount = await vendorModel.countDocuments({ deleted: false });
        // let adminsCount = await adminModel.countDocuments({ deleted: false, role: UserRole.ADMIN });
        return {
            usersCount,
            categoriesCount,
            // collectionsCount,
            // couponsCount,
            totalOrderCount: totalOrderCount.meta.pagination.total,
            // cancelOrderCount,
            // returnOrderCount,
            productsCount,
            // vendorsCount,
            // adminsCount,
            // balance,
        };
    }
    catch (error) {
        throw error;
    }
});
const vendorDashboradInfo = (req) => __awaiter(void 0, void 0, void 0, function* () {
    var _f, _g, _h, _j, _k;
    try {
        let chartYear = ((_f = req.query) === null || _f === void 0 ? void 0 : _f.chartYear) ? +((_g = req.query) === null || _g === void 0 ? void 0 : _g.chartYear) : (0, moment_1.default)().year();
        let currentDate = (0, moment_1.default)();
        let currentYear = (0, moment_1.default)().year();
        let userToJson = req.user.toJSON();
        let orderCondition = {};
        orderCondition.vendor = mongoose_1.default.Types.ObjectId(userToJson._id);
        let isCurrentYear = chartYear == currentYear;
        // let balance = await transactionService.getBalance(userToJson._id, userToJson.role);
        let productsCount = yield models_1.productModel.countDocuments({ vendor: userToJson._id });
        let deleveredOrderValue = yield models_1.orderModel.aggregate([
            { $match: Object.assign(Object.assign({}, orderCondition), { currentOrderStatus: interfaces_1.OrderStatus.DELIVERED }) },
            { $group: { _id: "$_id", totalAmount: { $sum: "$total" } } },
        ]);
        let cancelOrderValue = yield models_1.orderModel.aggregate([
            { $match: Object.assign(Object.assign({}, orderCondition), { currentOrderStatus: interfaces_1.OrderStatus.CANCELLED }) },
            { $group: { _id: "$_id", totalAmount: { $sum: "$total" } } },
        ]);
        let returnOrderValue = yield models_1.orderModel.aggregate([
            { $match: Object.assign(Object.assign({}, orderCondition), { currentOrderStatus: interfaces_1.OrderStatus.RETURNED }) },
            { $group: { _id: "$_id", totalAmount: { $sum: "$total" } } },
        ]);
        let chartConditions = {};
        let chartList = [];
        if (isCurrentYear) {
            chartConditions = { $or: [] };
            let subDate = (0, moment_1.default)(currentDate.clone().subtract(11, "months").format(utils_1.CONSTANT.DATE));
            for (let d = subDate; d <= currentDate; d = d.add(1, "months")) {
                chartList.push({ month: d.month() + 1, year: d.year(), name: d.format("MMM") });
                chartConditions["$or"].push({ $and: [{ year: d.year() }, { month: d.month() + 1 }] });
            }
        }
        else {
            let subDate = (0, moment_1.default)(new Date(chartYear, 1, 0));
            let lastDate = (0, moment_1.default)(new Date(chartYear, 12, 0));
            for (let d = subDate; d < lastDate; d = d.add(1, "months")) {
                chartList.push({ month: d.month() + 1, year: d.year(), name: d.format("MMM") });
            }
            chartConditions = { year: chartYear };
        }
        let chartData = yield models_1.orderModel.aggregate([
            { $addFields: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } } },
            {
                $addFields: {
                    stryear: { $toString: { $year: "$createdAt" } },
                    strmonth: { $toString: { $month: "$createdAt" } },
                },
            },
            { $addFields: { dd: { $concat: ["$stryear", "-", "$strmonth"] } } },
            {
                $match: Object.assign(Object.assign({}, orderCondition), { currentOrderStatus: { $in: [interfaces_1.OrderStatus.DELIVERED, interfaces_1.OrderStatus.CANCELLED, interfaces_1.OrderStatus.RETURNED] } }),
            },
            { $lookup: { from: "products", localField: "product", foreignField: "_id", as: "product" } },
            { $unwind: { path: "$product" } },
            { $match: chartConditions },
            { $sort: { year: 1, month: 1 } },
            { $group: { _id: "$dd", month: { $first: "$month" }, year: { $first: "$year" }, orders: { $push: "$$ROOT" } } },
        ]);
        chartData = chartList.map((d, i) => {
            var _a, _b, _c, _d, _e, _f;
            let data = (chartData || []).find((m) => m.month == d.month);
            let cancelledOrders = ((_a = data === null || data === void 0 ? void 0 : data.orders) === null || _a === void 0 ? void 0 : _a.filter((d) => d.currentOrderStatus == interfaces_1.OrderStatus.CANCELLED)) || [];
            let returnedOrders = ((_b = data === null || data === void 0 ? void 0 : data.orders) === null || _b === void 0 ? void 0 : _b.filter((d) => d.currentOrderStatus == interfaces_1.OrderStatus.RETURNED)) || [];
            let delevereddOrders = ((_c = data === null || data === void 0 ? void 0 : data.orders) === null || _c === void 0 ? void 0 : _c.filter((d) => d.currentOrderStatus == interfaces_1.OrderStatus.DELIVERED)) || [];
            return {
                name: (_d = chartList[i]) === null || _d === void 0 ? void 0 : _d.name,
                month: (_e = chartList[i]) === null || _e === void 0 ? void 0 : _e.month,
                year: (_f = chartList[i]) === null || _f === void 0 ? void 0 : _f.year,
                cancelledOrders: cancelledOrders.reduce((t, c) => t + c.total, 0),
                returnedOrders: returnedOrders.reduce((t, c) => t + c.total, 0),
                delevereddOrders: delevereddOrders.reduce((t, c) => t + c.total, 0),
            };
        });
        return {
            chartData,
            productsCount,
            deleveredOrderValue: ((_h = deleveredOrderValue[0]) === null || _h === void 0 ? void 0 : _h.totalAmount) || 0,
            cancelOrderValue: ((_j = cancelOrderValue[0]) === null || _j === void 0 ? void 0 : _j.totalAmount) || 0,
            returnOrderValue: ((_k = returnOrderValue[0]) === null || _k === void 0 ? void 0 : _k.totalAmount) || 0,
        };
    }
    catch (error) {
        throw error;
    }
});
const subscribe = (email, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let user = yield models_1.subscriberModel.findOne({ email });
        if (user)
            throw utils_1.helper.buildError("This email already exists", 400);
        yield models_1.subscriberModel.create({ email });
        utils_1.helper.buildResponse(res, "Subscribe successfully");
        yield utils_1.emailHandler.sentSubscribeMail(email);
    }
    catch (error) {
        throw error;
    }
});
const updateStatus = (userId, status) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let user = yield models_1.userModel.findOne({ _id: userId });
        if (!user)
            throw utils_1.helper.buildError("no user found with this id", 404);
        yield user.set({ isActive: status }).save();
    }
    catch (error) {
        throw error;
    }
});
const deleteMe = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield req.user.delete();
    }
    catch (error) {
        throw error;
    }
});
const getAppHomePage = (queryParams) => __awaiter(void 0, void 0, void 0, function* () {
    var _l, e_2, _m, _o;
    var _p, _q;
    try {
        let conditions = { isApproved: interfaces_1.ApprovalStatus.APPROVED, status: true };
        if ("userId" in queryParams)
            conditions.userId = queryParams.userId;
        let wishlistItems = [];
        let cartItems = [];
        let bdItems = [];
        if ((_p = queryParams === null || queryParams === void 0 ? void 0 : queryParams.userId) === null || _p === void 0 ? void 0 : _p.length) {
            wishlistItems = yield models_1.wishlistModel.find({ user: queryParams === null || queryParams === void 0 ? void 0 : queryParams.userId });
            cartItems = yield models_1.cartModel.find({ user: queryParams === null || queryParams === void 0 ? void 0 : queryParams.userId });
            bdItems = yield models_1.bdProductModel.find({ user: queryParams === null || queryParams === void 0 ? void 0 : queryParams.userId });
        }
        let updatedCategories = [];
        let brands = yield _1.brandService.getBrands({ page: 1, pageSize: 8, isApproved: true });
        let { docs: mainCategories } = yield _1.mainCatService.getMainCategories({ page: 1, pageSize: 10, status: true });
        let { docs: topCategories } = yield _1.categoryService.getMainCategories({ page: 1, pageSize: 10, status: true });
        let adsItems = ((_q = (yield _1.adsService.getAdss({ location: "HOME" }))) === null || _q === void 0 ? void 0 : _q.docs) || [];
        let i = 1;
        try {
            for (var _r = true, mainCategories_1 = __asyncValues(mainCategories), mainCategories_1_1; mainCategories_1_1 = yield mainCategories_1.next(), _l = mainCategories_1_1.done, !_l;) {
                _o = mainCategories_1_1.value;
                _r = false;
                try {
                    let cat = _o;
                    conditions = Object.assign(Object.assign({}, conditions), { mainCategory: cat._id, page: 1, pageSize: 4 });
                    let { docs: products } = yield _1.productService.getProducts(conditions);
                    products = products.map((p) => {
                        p.isFav = false;
                        p.isInCart = false;
                        p.cartQuantity = 0;
                        p.isBadalDaloAvailable = false;
                        p.isBadalDaloInfo = null;
                        if (wishlistItems === null || wishlistItems === void 0 ? void 0 : wishlistItems.length) {
                            if (wishlistItems.find((w) => w.product.toString() == p._id.toString()))
                                p.isFav = true;
                        }
                        if (cartItems === null || cartItems === void 0 ? void 0 : cartItems.length) {
                            p.variants = p.variants.map((v) => {
                                let cartItem = cartItems.find((ci) => {
                                    return ci.product.toString() == p._id.toString() && ci.variant._id.toString() == v._id.toString();
                                });
                                if (cartItem) {
                                    v.isInCart = true;
                                    p.isInCart = true;
                                }
                                return v;
                            });
                        }
                        if (bdItems === null || bdItems === void 0 ? void 0 : bdItems.length) {
                            let isExists = bdItems.find((w) => {
                                return w.product.toString() == p._id.toString() && w.variant == p.variants[0]._id.toString();
                            });
                            if (isExists) {
                                p.isBadalDaloAvailable = true;
                                p.isBadalDaloInfo = isExists;
                            }
                        }
                        return p;
                    });
                    let data = Object.assign(Object.assign({}, cat.toJSON()), { ads: null, products: products });
                    // if (i % 2 != 0 && adsItems[i - 1]) data.ads = adsItems[i - 1];
                    if (adsItems[i - 1])
                        data.ads = adsItems[i - 1];
                    if (data.products.length)
                        updatedCategories.push(data);
                    i++;
                }
                finally {
                    _r = true;
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (!_r && !_l && (_m = mainCategories_1.return)) yield _m.call(mainCategories_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
        let sliders = yield _1.sliderService.getSlider({});
        // let products = await productModel.find(conditions).sort({ createdAt: -1 }).limit(10);
        return { topCategories, categories: updatedCategories, sliders, brands };
    }
    catch (error) {
        throw error;
    }
});
const updateProfile = (req, data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield req.user.set(data).save();
    }
    catch (error) {
        throw error;
    }
});
const saveUserFeedback = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield models_1.userFeedbackModel.create(data);
    }
    catch (error) {
        throw error;
    }
});
const getFeedBacks = (queryParams) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let pageInfo = utils_1.helper.checkPagination(queryParams);
        let docs = [];
        let count = yield models_1.userFeedbackModel.countDocuments();
        let mongoQuery = models_1.userFeedbackModel.find().sort({ createdAt: -1 });
        if (pageInfo)
            docs = yield mongoQuery.skip(pageInfo.skip).limit(pageInfo.pageSize);
        else
            docs = yield mongoQuery;
        return utils_1.helper.makePaginatedData(docs, count, pageInfo);
    }
    catch (error) {
        throw error;
    }
});
exports.default = {
    getUsers,
    adminDashboradInfo,
    vendorDashboradInfo,
    subscribe,
    updateStatus,
    getAppHomePage,
    updateProfile,
    saveUserFeedback,
    getFeedBacks,
    deleteMe,
};
