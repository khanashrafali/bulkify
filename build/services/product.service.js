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
const lodash_1 = __importDefault(require("lodash"));
const mongoose_1 = __importDefault(require("mongoose"));
const json2csv_1 = require("json2csv");
const validator_1 = __importDefault(require("validator"));
const _1 = require(".");
const models_1 = require("../models");
const utils_1 = require("../utils");
const interfaces_1 = require("../utils/interfaces");
utils_1.helper.loadEnvFile();
/**
 * find Product
 */
const findProduct = (productIdOrSlug) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let conditions = checkProductIdOrSlug({}, productIdOrSlug);
        let product = yield _populateProduct(models_1.productModel.findOne(conditions), {}, true);
        if (!product)
            throw utils_1.helper.buildError("No product found with this id/slug", 404);
        return product;
    }
    catch (error) {
        throw error;
    }
});
const checkProductIdOrSlug = (conditions, productIdOrSlug) => {
    if (validator_1.default.isMongoId(productIdOrSlug === null || productIdOrSlug === void 0 ? void 0 : productIdOrSlug.toString()))
        conditions._id = productIdOrSlug;
    else
        conditions.slug = productIdOrSlug;
    return conditions;
};
/**
 * find Best Selling Products
 */
const getBestSellingProducts = (pageInfo, conditions) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        let docs = pageInfo
            ? [{ $sort: { sumOfQuantity: -1 } }, { $skip: pageInfo.skip }, { $limit: pageInfo.pageSize }]
            : [];
        let stages = [
            { $unwind: { path: "$orders" } },
            { $unwind: { path: "$orders.products" } },
            { $group: { _id: "$orders.products.item", sumOfQuantity: { $sum: 1 } } },
            { $lookup: { from: "products", localField: "_id", foreignField: "_id", as: "item" } },
            { $unwind: { path: "$item" } },
            {
                $replaceRoot: {
                    newRoot: { $mergeObjects: [{ sumOfQuantity: "$sumOfQuantity" }, "$item"] },
                },
            },
            {
                $lookup: {
                    from: "users",
                    let: { id: "$vendor" },
                    pipeline: [{ $match: { $expr: { $eq: ["$_id", "$$id"] } } }, { $project: { name: 1, vendorInfo: 1 } }],
                    as: "vendor",
                },
            },
            { $unwind: { path: "$vendor" } },
            {
                $lookup: {
                    from: "vendors",
                    let: { id: "$vendor.vendorInfo" },
                    pipeline: [{ $match: { $expr: { $eq: ["$_id", "$$id"] } } }, { $project: { businessName: 1 } }],
                    as: "vendor.vendorInfo",
                },
            },
            { $unwind: { path: "$vendor.vendorInfo" } },
            { $match: conditions },
            { $facet: { meta: [{ $count: "count" }], docs: docs } },
            { $unwind: { path: "$meta" } },
            { $project: { count: "$meta.count", docs: "$docs" } },
        ];
        // find ordered products and sort by quantity in desc order
        let orderedProducts = yield models_1.orderModel.aggregate(stages);
        let data = orderedProducts[0] ? orderedProducts[0] : [];
        return utils_1.helper.makePaginatedData((_a = data === null || data === void 0 ? void 0 : data.docs) !== null && _a !== void 0 ? _a : [], (data === null || data === void 0 ? void 0 : data.count) || 0, pageInfo);
    }
    catch (error) {
        throw error;
    }
});
/**
 * get product list by collection slug/id handler
 */
const _getProductByCollection = (collection, queryParams) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        let conditions = { status: true };
        let colToJson = collection.toJSON();
        let collConditions = [];
        if (queryParams === null || queryParams === void 0 ? void 0 : queryParams._id)
            conditions._id = queryParams === null || queryParams === void 0 ? void 0 : queryParams._id;
        for (let cond of colToJson.conditions || []) {
            let query = utils_1.helper.getProductQuery(cond.field, cond.condition, cond.value);
            if (query)
                collConditions.push(query);
        }
        if (collConditions === null || collConditions === void 0 ? void 0 : collConditions.length) {
            if (colToJson.mustMatchAll)
                conditions["$and"] = collConditions;
            else
                conditions["$or"] = collConditions;
        }
        if ((_b = queryParams.textSearch) === null || _b === void 0 ? void 0 : _b.length)
            conditions.metaDescription = {
                $regex: utils_1.helper.regxEscape(queryParams.textSearch),
                $options: "i",
            };
        return yield _populateProduct(models_1.productModel.findOne(conditions), queryParams);
    }
    catch (error) {
        throw error;
    }
});
/**
 * build conditions
 */
const _setConditions = (queryParams, conditions, userObj, role) => {
    var _a, _b;
    if (queryParams.textSearch && ((_a = validator_1.default.trim(queryParams.textSearch)) === null || _a === void 0 ? void 0 : _a.length))
        conditions["$text"] = { $search: queryParams.textSearch };
    if (userObj && role == interfaces_1.UserRole.VENDOR) {
        conditions["$and"] = (_b = conditions["$and"]) !== null && _b !== void 0 ? _b : [];
        conditions["$and"].push({ vendor: userObj._id });
    }
    if ("status" in queryParams)
        conditions.status = queryParams.status;
    if ("createdAt" in queryParams)
        conditions.date = queryParams.createdAt;
    if ("isApproved" in queryParams)
        conditions.isApproved = queryParams.isApproved;
    if ("type" in queryParams)
        conditions.type = queryParams.type;
    if ("vendor" in queryParams)
        conditions.vendor = queryParams.vendor;
    return conditions;
};
const _populateProductByAdmin = (query, queryParams, isSingle = false) => {
    var _a, _b;
    const sortBy = ((_a = queryParams === null || queryParams === void 0 ? void 0 : queryParams.sortBy) === null || _a === void 0 ? void 0 : _a.length) ? queryParams === null || queryParams === void 0 ? void 0 : queryParams.sortBy : "createdAt";
    const orderBy = (_b = queryParams === null || queryParams === void 0 ? void 0 : queryParams.orderBy) !== null && _b !== void 0 ? _b : "DESC";
    query
        .populate({
        path: "brand",
        select: "brandName image isApproved deleted",
    })
        .populate({
        path: "category",
        select: "name image status deleted",
    })
        .populate({
        path: "subCategory",
        select: "name image status deleted",
    });
    if (!isSingle)
        query.sort({ [sortBy]: orderBy });
    return query;
};
/**
 * populate product data
 */
const _populateProduct = (query, queryParams, isSingle = false) => {
    var _a, _b;
    const sortBy = ((_a = queryParams === null || queryParams === void 0 ? void 0 : queryParams.sortBy) === null || _a === void 0 ? void 0 : _a.length) ? queryParams === null || queryParams === void 0 ? void 0 : queryParams.sortBy : "createdAt";
    const orderBy = (_b = queryParams === null || queryParams === void 0 ? void 0 : queryParams.orderBy) !== null && _b !== void 0 ? _b : "DESC";
    query
        // .populate({
        //   path: "vendor",
        //   select: "avatar images video name email mobileNumber bio isActive isApproved deleted address",
        //   match: { deleted: false, isActive: true, isApproved: ApprovalStatus.APPROVED },
        // })
        .populate({
        path: "brand",
        select: "brandName image isApproved deleted",
        match: { deleted: false, isApproved: true },
    })
        .populate({
        path: "category",
        select: "name image status deleted",
        match: { deleted: false, status: true },
    })
        .populate({
        path: "subCategory",
        select: "name image status deleted",
        match: { deleted: false, status: true },
    });
    // .populate({
    //   path: "subCategories",
    //   select: "name image status deleted",
    //   match: { deleted: false, status: true },
    // })
    // .populate({
    //   path: "mainCategories",
    //   select: "name image status deleted",
    //   match: { deleted: false, status: true },
    // });
    if (!isSingle)
        query.sort({ [sortBy]: orderBy });
    return query;
};
/**
 * sort products variants by price in asc
 */
const _sortVariantsByProducts = (products, role = interfaces_1.UserRole.USER, collection) => {
    return products.map((item) => {
        if (collection)
            item = Object.assign(Object.assign({}, item._doc), { collectionName: collection.title });
        item.variants = lodash_1.default.sortBy(item.variants, ["variant.price"]);
        if (role == interfaces_1.UserRole.USER)
            item.variants = item.variants.filter((v) => !(v === null || v === void 0 ? void 0 : v.deleted));
        item.isFav = false;
        item.isInCart = false;
        return item;
    });
};
/**
 * create product handler
 */
const addProduct = (req, body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { variants } = body;
        variants = variants.map((v) => (Object.assign(Object.assign({}, v), { totalQty: v.quantity })));
        let vendorObj = req.user.toJSON();
        // if (!vendorObj?.isProfileComplete) throw helper.buildError("Can't add product because your profile is incomplete", 400);
        // if (vendorObj.isApproved != ApprovalStatus.APPROVED) {
        //   throw helper.buildError("Can't add product because your profile status is " + vendorObj.isApproved, 400);
        // }
        // if (!vendorObj.isActive)
        //   throw helper.buildError("Can't add product because your profile is unactivated by admin", 400);
        // let location = await shiprocketService.getPickupAddress(vendorObj.pickupLocation);
        // if (!location?.phone_verified) throw helper.buildError("Your address verification in pending, please try again later", 400);
        return yield models_1.productModel.create(Object.assign(Object.assign({}, body), { vendor: vendorObj._id, variants: lodash_1.default.sortBy(variants, ["variant.mrp"]), isApproved: interfaces_1.ApprovalStatus.APPROVED }));
    }
    catch (error) {
        throw error;
    }
});
/**
 * update product handler
 */
const updateProduct = (req, productIdOrSlug, body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { vendor, name, description, images, variants, status, metaDescription } = body;
        let vendorObj = req.user.toJSON();
        if (vendor)
            vendorObj = yield models_1.vendorModel.findOne({ _id: vendor }).lean();
        const product = yield models_1.productModel.findOne(checkProductIdOrSlug({}, productIdOrSlug));
        if (!product)
            throw utils_1.helper.buildError("No product found with this id", 404);
        const productObj = product.toJSON();
        if (productObj.vendor.toString() != vendorObj._id.toString()) {
            throw utils_1.helper.buildError("You can't update this product", 400);
        }
        if (productObj.variants.length != variants.filter((v) => v._id).length) {
            throw utils_1.helper.buildError("old variant mismatch with new data", 400);
        }
        variants = variants.map((v) => {
            if (!v._id)
                delete v._id;
            return Object.assign(Object.assign({}, v), { totalQty: v.quantity });
        });
        images = (images === null || images === void 0 ? void 0 : images.length) ? images : productObj.images;
        variants = lodash_1.default.sortBy(variants, ["variant.mrp"]);
        const isApproved = interfaces_1.ApprovalStatus.APPROVED;
        return yield product.set(Object.assign(Object.assign({}, body), { isApproved, variants, images, vendor: vendorObj._id })).save();
    }
    catch (error) {
        throw error;
    }
});
/**
 * create product handler
 */
const addProductByAdmin = (req, body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { variants } = body;
        variants = variants.map((v) => (Object.assign(Object.assign({}, v), { totalQty: v.quantity })));
        let saveProduct = yield models_1.productModel.create(Object.assign(Object.assign({}, body), { variants: lodash_1.default.sortBy(variants, ["variant.mrp"]), isApproved: interfaces_1.ApprovalStatus.APPROVED }));
        return saveProduct._id;
    }
    catch (error) {
        throw error;
    }
});
/**
 * update product handler
 */
const updateProductByAdmin = (req, productIdOrSlug, body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { name, description, images, variants, status, metaDescription } = body;
        const product = yield models_1.productModel.findOne({ _id: productIdOrSlug });
        if (!product)
            throw utils_1.helper.buildError("No product found with this id", 404);
        const productObj = product.toJSON();
        variants = variants.map((v) => {
            if (!v._id)
                delete v._id;
            return v;
        });
        const isApproved = interfaces_1.ApprovalStatus.APPROVED;
        variants = lodash_1.default.sortBy(variants, ["variant.mrp"]);
        images = (images === null || images === void 0 ? void 0 : images.length) ? images : productObj.images;
        return yield product.set(Object.assign(Object.assign({}, body), { isApproved, variants, images })).save();
    }
    catch (error) {
        throw error;
    }
});
/**
 * delete product handler
 */
const deleteProduct = (req, productIdOrSlug) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let conditions = {};
        const product = yield models_1.productModel.findOne(checkProductIdOrSlug(conditions, productIdOrSlug));
        if (!product)
            throw utils_1.helper.buildError("No product found with this id/slug", 404);
        const productToJson = product.toJSON();
        const userObj = req.user.toJSON();
        // if (product.status) throw helper.buildError("Active product can't be deleted", 400);
        if (![interfaces_1.UserRole.ADMIN, interfaces_1.UserRole.SUPER_ADMIN].includes(userObj === null || userObj === void 0 ? void 0 : userObj.role)) {
            if (productToJson.vendor.toString() != userObj._id.toString())
                throw utils_1.helper.buildError("You can't delete this product", 400);
        }
        yield product.delete();
    }
    catch (error) {
        throw error;
    }
});
/**
 * delete product handler
 */
const deleteProductImage = (productIdOrSlug, locations) => { var _a, locations_1, locations_1_1; return __awaiter(void 0, void 0, void 0, function* () {
    var _b, e_1, _c, _d;
    try {
        const product = yield models_1.productModel.findOne(checkProductIdOrSlug({}, productIdOrSlug));
        if (!product)
            throw utils_1.helper.buildError("No product found with this id", 404);
        const productToJson = product.toJSON();
        yield product.set({ images: productToJson.images.filter((url) => locations === null || locations === void 0 ? void 0 : locations.find((e) => url != e)) }).save();
        try {
            for (_a = true, locations_1 = __asyncValues(locations); locations_1_1 = yield locations_1.next(), _b = locations_1_1.done, !_b;) {
                _d = locations_1_1.value;
                _a = false;
                try {
                    let location = _d;
                    yield utils_1.fileHandler.deleteFromS3(location);
                }
                finally {
                    _a = true;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_a && !_b && (_c = locations_1.return)) yield _c.call(locations_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    }
    catch (error) {
        throw error;
    }
}); };
/**
 * get single product handler
 */
const getProduct = (productIdOrSlug, queryParams) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let wishlistItems = [];
        let cartItems = [];
        let bdItems = [];
        if (queryParams === null || queryParams === void 0 ? void 0 : queryParams.userId) {
            let user = yield models_1.userModel.findOne({ _id: queryParams === null || queryParams === void 0 ? void 0 : queryParams.userId });
            if (!user)
                throw utils_1.helper.buildError("no user found with id", 404);
            wishlistItems = yield models_1.wishlistModel.find({ user: user });
            cartItems = yield models_1.cartModel.find({ user: user });
            bdItems = yield models_1.bdProductModel.find({ user: user });
        }
        let conditions = checkProductIdOrSlug({}, productIdOrSlug);
        let product = yield _populateProduct(models_1.productModel.findOne(conditions), {}, true);
        if (!product)
            throw utils_1.helper.buildError("No product found with this id/slug", 404);
        let productObj = product.toJSON();
        productObj.isFav = false;
        productObj.variants = productObj.variants.map((v) => {
            v.isInCart = false;
            v.cartQuantity = 0;
            v.isBadalDaloAvailable = false;
            v.isBadalDaloInfo = null;
            return v;
        });
        if (wishlistItems === null || wishlistItems === void 0 ? void 0 : wishlistItems.length) {
            if (wishlistItems.find((w) => w.product.toString() == productObj._id.toString())) {
                productObj.isFav = true;
            }
        }
        if (cartItems === null || cartItems === void 0 ? void 0 : cartItems.length) {
            productObj.variants = productObj.variants.map((v) => {
                let cartItem = cartItems.find((ci) => {
                    return ci.product.toString() == productObj._id.toString() && ci.variant._id.toString() == v._id.toString();
                });
                if (cartItem)
                    v.isInCart = true;
                return v;
            });
        }
        if (bdItems === null || bdItems === void 0 ? void 0 : bdItems.length) {
            productObj.variants = productObj.variants.map((v) => {
                let isExists = bdItems.find((w) => {
                    return w.product.toString() == productObj._id.toString() && w.variant == v._id.toString();
                });
                if (isExists) {
                    v.isBadalDaloAvailable = true;
                    v.isBadalDaloInfo = isExists;
                }
                return v;
            });
        }
        productObj.totalQty = productObj.variants.reduce((p, cv) => p + cv.variant.quantity, 0);
        let reviews = yield _1.reviewService.getProductReviews(productObj._id);
        return Object.assign(Object.assign({}, productObj), { reviews });
    }
    catch (error) {
        throw error;
    }
});
/**
 * get single product by admin handler
 */
const getProductByAdmin = (productIdOrSlug) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let conditions = checkProductIdOrSlug({}, productIdOrSlug);
        let product = yield _populateProductByAdmin(models_1.productModel.findOne(conditions), {}, true);
        if (!product)
            throw utils_1.helper.buildError("No product found with this id/slug", 404);
        return product;
    }
    catch (error) {
        throw error;
    }
});
/**
 * get single product by vendor handler
 */
const getProductByVendor = (productIdOrSlug) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let conditions = checkProductIdOrSlug({}, productIdOrSlug);
        let product = yield _populateProduct(models_1.productModel.findOne(conditions), {}, true);
        if (!product)
            throw utils_1.helper.buildError("No product found with this id/slug", 404);
        return product;
    }
    catch (error) {
        throw error;
    }
});
/**
 * get product list by admin handler
 */
const getProductsByAdmin = (req, queryParams) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let conditions = {};
        let vendorObj = req.user.toJSON();
        const pageInfo = utils_1.helper.checkPagination(queryParams);
        conditions = _setConditions(queryParams, conditions, vendorObj, req.role);
        // set filter by
        if ("filterBy" in queryParams) {
            let filterBy = utils_1.CONSTANT.FILTER_DROPDOWN.find((v) => v.key == queryParams.filterBy);
            if (filterBy) {
                queryParams.sortBy = filterBy === null || filterBy === void 0 ? void 0 : filterBy.sortBy;
                queryParams.orderBy = filterBy === null || filterBy === void 0 ? void 0 : filterBy.orderBy;
            }
            if ((filterBy === null || filterBy === void 0 ? void 0 : filterBy.key) && ["PRICE_LOW_TO_HIGH", "PRICE_HIGH_TO_LOW"].includes(filterBy.key)) {
                conditions.variants = { $ne: [] };
                conditions["variants.variant.mrp"] = { $ne: null };
            }
            if ("FEATURED" == queryParams.filterBy)
                conditions.isFeatured = true;
            if ("BEST_SELLING" == queryParams.filterBy)
                return yield getBestSellingProducts(pageInfo, conditions);
        }
        console.log(conditions);
        const count = yield models_1.productModel.countDocuments(conditions);
        const mongoQuery = models_1.productModel.find(conditions).collation({ locale: "en" });
        let docs = [];
        if (pageInfo)
            docs = yield _populateProduct(mongoQuery.skip(pageInfo.skip).limit(pageInfo.pageSize), queryParams);
        else
            docs = yield _populateProduct(mongoQuery, queryParams);
        return utils_1.helper.makePaginatedData(_sortVariantsByProducts(docs), count, pageInfo);
    }
    catch (error) {
        throw error;
    }
});
/**
 * get product list by vendor handler
 */
const getProductsByVendor = (req, queryParams) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let conditions = {};
        let userToJson = req.user.toJSON();
        const pageInfo = utils_1.helper.checkPagination(queryParams);
        conditions = _setConditions(queryParams, conditions, userToJson, req.role);
        // set filter by
        if ("filterBy" in queryParams) {
            let filterBy = utils_1.CONSTANT.FILTER_DROPDOWN.find((v) => v.key == queryParams.filterBy);
            if (filterBy) {
                queryParams.sortBy = filterBy === null || filterBy === void 0 ? void 0 : filterBy.sortBy;
                queryParams.orderBy = filterBy === null || filterBy === void 0 ? void 0 : filterBy.orderBy;
            }
            if ((filterBy === null || filterBy === void 0 ? void 0 : filterBy.key) && ["PRICE_LOW_TO_HIGH", "PRICE_HIGH_TO_LOW"].includes(filterBy.key)) {
                conditions.variants = { $ne: [] };
                conditions["variants.variant.mrp"] = { $ne: null };
            }
            if ("FEATURED" == queryParams.filterBy)
                conditions.isFeatured = true;
            if ("BEST_SELLING" == queryParams.filterBy)
                return yield getBestSellingProducts(pageInfo, conditions);
        }
        const count = yield models_1.productModel.countDocuments(conditions);
        const mongoQuery = models_1.productModel.find(conditions).collation({ locale: "en" });
        let docs = [];
        if (pageInfo)
            docs = yield _populateProduct(mongoQuery.skip(pageInfo.skip).limit(pageInfo.pageSize), queryParams);
        else
            docs = yield _populateProduct(mongoQuery, queryParams);
        return utils_1.helper.makePaginatedData(_sortVariantsByProducts(docs), count, pageInfo);
    }
    catch (error) {
        throw error;
    }
});
/**
 * get product list handler
 */
const getProducts = (queryParams) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let user;
        let wishlistItems = [];
        let cartItems = [];
        let bdItems = [];
        if (queryParams === null || queryParams === void 0 ? void 0 : queryParams.userId) {
            user = yield models_1.userModel.findOne({ _id: queryParams === null || queryParams === void 0 ? void 0 : queryParams.userId });
            if (!user)
                throw utils_1.helper.buildError("no user found with id", 404);
            wishlistItems = yield models_1.wishlistModel.find({ user: user });
            cartItems = yield models_1.cartModel.find({ user: user });
            bdItems = yield models_1.bdProductModel.find({ user: queryParams === null || queryParams === void 0 ? void 0 : queryParams.userId });
        }
        let conditions = { status: true, isApproved: interfaces_1.ApprovalStatus.APPROVED };
        const pageInfo = utils_1.helper.checkPagination(queryParams);
        conditions = _setConditions(queryParams, conditions, null, interfaces_1.UserRole.USER);
        if ("product" in queryParams) {
            conditions._id = { $ne: queryParams.product };
        }
        if ("category" in queryParams) {
            let cat = yield models_1.categoryModel
                .findOne({ _id: queryParams.category, level: 0 })
                .populate({
                path: "subCategories",
                populate: { path: "subCategories" },
            })
                .lean();
            if (cat) {
                if (!cat.status || cat.deleted)
                    conditions.category = { $ne: queryParams.category };
                else
                    conditions.category = queryParams.category;
            }
            if ("subCategory" in queryParams) {
                let cat2 = cat.subCategories.find((v) => v._id.toString() == queryParams.subCategory);
                if (cat2) {
                    if (!cat2.status || cat2.deleted) {
                        conditions.subCategory = { $ne: queryParams.subCategory };
                    }
                    else
                        conditions.subCategory = queryParams.subCategory;
                }
                if ("childCategory" in queryParams) {
                    let cat3 = cat2.subCategories.find((v) => v._id.toString() == queryParams.childCategory);
                    if (cat3) {
                        if (!cat3.status || cat3.deleted) {
                            conditions.subCategories = { $nin: [queryParams.childCategory] };
                        }
                        else {
                            conditions.subCategories = { $in: [queryParams.childCategory] };
                        }
                    }
                }
            }
        }
        if ("mainCategory" in queryParams)
            conditions.mainCategories = queryParams.mainCategory;
        // set filter by
        if ("filterBy" in queryParams) {
            let filterBy = utils_1.CONSTANT.FILTER_DROPDOWN.find((v) => v.key == queryParams.filterBy);
            if (filterBy) {
                queryParams.sortBy = filterBy === null || filterBy === void 0 ? void 0 : filterBy.sortBy;
                queryParams.orderBy = filterBy === null || filterBy === void 0 ? void 0 : filterBy.orderBy;
            }
            if ((filterBy === null || filterBy === void 0 ? void 0 : filterBy.key) && ["PRICE_LOW_TO_HIGH", "PRICE_HIGH_TO_LOW"].includes(filterBy.key)) {
                conditions.variants = { $ne: [] };
                conditions["variants.variant.mrp"] = { $ne: null };
            }
            if ("FEATURED" == queryParams.filterBy)
                conditions.isFeatured = true;
            if ("BEST_SELLING" == queryParams.filterBy) {
                return yield getBestSellingProducts(pageInfo, conditions);
            }
        }
        const count = yield models_1.productModel.countDocuments(conditions);
        const mongoQuery = models_1.productModel.find(conditions).collation({ locale: "en" });
        let docs = [];
        if (pageInfo) {
            docs = yield _populateProduct(mongoQuery.skip(pageInfo.skip).limit(pageInfo.pageSize).lean(), queryParams);
        }
        else
            docs = yield _populateProduct(mongoQuery.lean(), queryParams);
        docs = _sortVariantsByProducts(docs, interfaces_1.UserRole.USER);
        docs = docs.map((p) => {
            p.isBadalDaloAvailable = false;
            p.isBadalDaloInfo = null;
            p.isFav = false;
            p.isInCart = false;
            p.totalQty = p.variants.reduce((p, cv) => p + cv.variant.quantity, 0);
            return p;
        });
        if (wishlistItems === null || wishlistItems === void 0 ? void 0 : wishlistItems.length) {
            docs = docs.map((p) => {
                if (wishlistItems.find((w) => w.product.toString() == p._id.toString()))
                    p.isFav = true;
                return p;
            });
        }
        if (bdItems === null || bdItems === void 0 ? void 0 : bdItems.length) {
            docs = docs.map((p) => {
                let isExists = bdItems.find((w) => {
                    return w.product.toString() == p._id.toString() && w.variant == p.variants[0]._id.toString();
                });
                if (isExists) {
                    p.isBadalDaloAvailable = true;
                    p.isBadalDaloInfo = isExists;
                }
                return p;
            });
        }
        if (cartItems === null || cartItems === void 0 ? void 0 : cartItems.length) {
            docs = docs.map((p) => {
                if (cartItems.find((w) => w.product.toString() == p._id.toString() && w.variant._id.toString() == p.variants[0]._id.toString())) {
                    p.isInCart = true;
                }
                return p;
            });
        }
        return utils_1.helper.makePaginatedData(docs, count, pageInfo);
    }
    catch (error) {
        throw error;
    }
});
const searchProducts = (queryParams) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d, _e, _f, _g, _h, _j, _k, _l;
    try {
        let user;
        let wishlistItems = [];
        let cartItems = [];
        let filterData = queryParams === null || queryParams === void 0 ? void 0 : queryParams.filterData;
        let adsItems = ((_c = (yield _1.adsService.getAdss({ location: "FILTER" }))) === null || _c === void 0 ? void 0 : _c.docs) || [];
        if (queryParams === null || queryParams === void 0 ? void 0 : queryParams.userId) {
            // user = await userModel.findOne({ _id: queryParams?.userId });
            // if (!user) throw helper.buildError("no user found with id", 404);
            wishlistItems = yield models_1.wishlistModel.find({ user: queryParams === null || queryParams === void 0 ? void 0 : queryParams.userId });
            cartItems = yield models_1.cartModel.find({ user: queryParams === null || queryParams === void 0 ? void 0 : queryParams.userId });
        }
        let conditions = { status: true, isApproved: interfaces_1.ApprovalStatus.APPROVED };
        const pageInfo = utils_1.helper.checkPagination(queryParams);
        conditions = _setConditions(queryParams, conditions, null, interfaces_1.UserRole.USER);
        if (filterData) {
            if ((_d = filterData === null || filterData === void 0 ? void 0 : filterData.categories) === null || _d === void 0 ? void 0 : _d.length) {
                conditions.category = { $in: filterData === null || filterData === void 0 ? void 0 : filterData.categories };
                // let cat: any = await categoryModel
                // .findOne({ _id: { $in: filterData?.categories }, level: 0 })
                // .populate({
                //   path: "subCategories",
                //   populate: { path: "subCategories" },
                // })
                // .lean();
                // if (cat) {
                //   if (!cat.status || cat.deleted) conditions.category = { $ne: mongoose.Types.ObjectId(queryParams.category) };
                //   else conditions.category = { $in: filterData?.categories };
                // }
                if ((_e = filterData === null || filterData === void 0 ? void 0 : filterData.subCategories) === null || _e === void 0 ? void 0 : _e.length) {
                    // let cat2 = cat.subCategories.find((v: any) => v._id.toString() == queryParams.subCategory);
                    // if (cat2) {
                    //   if (!cat2.status || cat2.deleted) {
                    //     conditions.subCategory = { $ne: mongoose.Types.ObjectId(queryParams.subCategory) };
                    //   } else conditions.subCategory = mongoose.Types.ObjectId(queryParams.subCategory);
                    // }
                    // if ("childCategory" in queryParams) {
                    //   let cat3 = cat2.subCategories.find((v: any) => v._id.toString() == queryParams.childCategory);
                    //   if (cat3) {
                    //     if (!cat3.status || cat3.deleted) {
                    //       conditions.subCategories = { $nin: [mongoose.Types.ObjectId(queryParams.childCategory)] };
                    //     } else {
                    //       conditions.subCategories = { $in: [mongoose.Types.ObjectId(queryParams.childCategory)] };
                    //     }
                    //   }
                    // }
                }
            }
            if (((_f = filterData === null || filterData === void 0 ? void 0 : filterData.price) === null || _f === void 0 ? void 0 : _f.from) || ((_g = filterData === null || filterData === void 0 ? void 0 : filterData.price) === null || _g === void 0 ? void 0 : _g.to)) {
                conditions["$and"] = [
                    { "variants.variant.sellingPrice": { $gte: filterData.price.from } },
                    { "variants.variant.sellingPrice": { $lte: filterData.price.to } },
                ];
            }
            if ((_h = filterData === null || filterData === void 0 ? void 0 : filterData.rating) === null || _h === void 0 ? void 0 : _h.length) {
                conditions["$and"] = (_j = filterData === null || filterData === void 0 ? void 0 : filterData.rating) === null || _j === void 0 ? void 0 : _j.map((r) => {
                    return { rating: { $gte: r } };
                    // if (adminRating)
                    // return { rating: { $gte: r } };
                });
                // conditions["$or"] = filterData?.rating?.map((r: any) => ({ adminRating: { $gte: r } }));
            }
            if ((_k = filterData === null || filterData === void 0 ? void 0 : filterData.brands) === null || _k === void 0 ? void 0 : _k.length) {
                conditions.brand = { $in: (_l = filterData === null || filterData === void 0 ? void 0 : filterData.brands) === null || _l === void 0 ? void 0 : _l.map((b) => mongoose_1.default.Types.ObjectId(b)) };
            }
        }
        // if ("mainCategory" in queryParams) conditions.mainCategories = mongoose.Types.ObjectId(queryParams.mainCategory);
        // if (filterData) {
        //   if (filterData?.price?.from || filterData?.price?.to) {
        //     conditions["$and"] = [
        //       { "variants.variant.sellingPrice": { $gte: filterData.price.from } },
        //       { "variants.variant.sellingPrice": { $lte: filterData.price.to } },
        //     ];
        //   }
        //   if (filterData?.rating?.length) {
        //     conditions["$and"] = filterData?.rating?.map((r: any) => {
        //       return { rating: { $gte: r } };
        //       // if (adminRating)
        //       // return { rating: { $gte: r } };
        //     });
        //     // conditions["$or"] = filterData?.rating?.map((r: any) => ({ adminRating: { $gte: r } }));
        //   }
        //   if (filterData?.brands?.length) {
        //     conditions.brand = { $in: filterData?.brands?.map((b: any) => mongoose.Types.ObjectId(b)) };
        //   }
        //   delete filterData.price;
        //   delete filterData.rating;
        //   delete filterData.brands;
        //   for (let k in filterData) {
        //     if (filterData[k]?.length) conditions[`variants.variant.${k}`] = { $in: filterData[k] };
        //   }
        // }
        // set filter by
        if ("filterBy" in queryParams) {
            let filterBy = utils_1.CONSTANT.FILTER_DROPDOWN.find((v) => v.key == queryParams.filterBy);
            if (filterBy) {
                queryParams.sortBy = filterBy === null || filterBy === void 0 ? void 0 : filterBy.sortBy;
                queryParams.orderBy = filterBy === null || filterBy === void 0 ? void 0 : filterBy.orderBy;
            }
            if ((filterBy === null || filterBy === void 0 ? void 0 : filterBy.key) && ["PRICE_LOW_TO_HIGH", "PRICE_HIGH_TO_LOW"].includes(filterBy.key)) {
                conditions.variants = { $ne: [] };
                conditions["variants.variant.mrp"] = { $ne: null };
            }
            if ("FEATURED" == queryParams.filterBy)
                conditions.isFeatured = true;
            if ("BEST_SELLING" == queryParams.filterBy)
                return yield getBestSellingProducts(pageInfo, conditions);
        }
        let newCondition = Object.assign({}, conditions);
        delete newCondition["$text"];
        let minMaxPrice = (yield models_1.productModel.aggregate([
            { $match: newCondition },
            // { $unwind: "$variants" },
            {
                $group: {
                    _id: "",
                    minPrice: { $min: "$variants.variant.sellingPrice" },
                    maxPrice: { $max: "$variants.variant.sellingPrice" },
                },
            },
            {
                $project: {
                    min: { $min: "$minPrice" },
                    max: { $max: "$maxPrice" },
                },
            },
        ]))[0];
        const count = yield models_1.productModel.countDocuments(conditions);
        const mongoQuery = models_1.productModel.find(conditions).collation({ locale: "en" });
        let docs = [];
        if (pageInfo) {
            docs = yield _populateProduct(mongoQuery.skip(pageInfo.skip).limit(pageInfo.pageSize).lean(), queryParams);
        }
        else
            docs = yield _populateProduct(mongoQuery.lean(), queryParams);
        docs = _sortVariantsByProducts(docs, interfaces_1.UserRole.USER);
        docs = docs.map((p) => {
            p.isBadalDaloAvailable = false;
            p.isBadalDaloInfo = null;
            p.isFav = false;
            p.isInCart = false;
            p.totalQty = p.variants.reduce((p, cv) => p + cv.variant.quantity, 0);
            return p;
        });
        if (wishlistItems === null || wishlistItems === void 0 ? void 0 : wishlistItems.length) {
            docs = docs.map((p) => {
                if (wishlistItems.find((w) => w.product.toString() == p._id.toString()))
                    p.isFav = true;
                return p;
            });
        }
        if (cartItems === null || cartItems === void 0 ? void 0 : cartItems.length) {
            docs = docs.map((p) => {
                if (cartItems.find((w) => w.product.toString() == p._id.toString()))
                    p.isInCart = true;
                return p;
            });
        }
        docs = docs.map((p, i) => {
            var _a;
            p.ads = (_a = adsItems[i]) !== null && _a !== void 0 ? _a : null;
            return p;
        });
        return utils_1.helper.makePaginatedData(docs, count, Object.assign(Object.assign({}, pageInfo), { min: (minMaxPrice === null || minMaxPrice === void 0 ? void 0 : minMaxPrice.min) || 0, max: (minMaxPrice === null || minMaxPrice === void 0 ? void 0 : minMaxPrice.max) || 1000 }));
    }
    catch (error) {
        throw error;
    }
});
/**
 * get product list by collection slug/id handler
 */
const getProductsByCollection = (collectionIdOrSlug, queryParams) => __awaiter(void 0, void 0, void 0, function* () {
    var _m;
    try {
        let collection = yield _1.collectionService.fetchCollection(collectionIdOrSlug);
        let conditions = { status: true, isApproved: interfaces_1.ApprovalStatus.APPROVED };
        let collectionObj = collection.toJSON();
        let collConditions = [];
        const pageInfo = utils_1.helper.checkPagination(queryParams);
        if (queryParams === null || queryParams === void 0 ? void 0 : queryParams._id)
            conditions._id = queryParams === null || queryParams === void 0 ? void 0 : queryParams._id;
        for (let cond of collectionObj.conditions || []) {
            let query = utils_1.helper.getProductQuery(cond.field, cond.condition, cond.value);
            if (query)
                collConditions.push(query);
        }
        if (collectionObj.mustMatchAll)
            conditions["$and"] = collConditions;
        else
            conditions["$or"] = collConditions;
        if ((_m = queryParams.textSearch) === null || _m === void 0 ? void 0 : _m.length)
            conditions["$text"] = { $search: queryParams.textSearch };
        // set filter by
        if ("filterBy" in queryParams) {
            let filterBy = utils_1.CONSTANT.FILTER_DROPDOWN.find((v) => v.key == queryParams.filterBy);
            if (filterBy) {
                queryParams.sortBy = filterBy === null || filterBy === void 0 ? void 0 : filterBy.sortBy;
                queryParams.orderBy = filterBy === null || filterBy === void 0 ? void 0 : filterBy.orderBy;
            }
            if ((filterBy === null || filterBy === void 0 ? void 0 : filterBy.key) && ["PRICE_LOW_TO_HIGH", "PRICE_HIGH_TO_LOW"].includes(filterBy.key)) {
                conditions.variants = { $ne: [] };
                conditions["variants.variant.mrp"] = { $ne: null };
            }
            if ("FEATURED" == queryParams.filterBy)
                conditions.isFeatured = true;
            if ("BEST_SELLING" == queryParams.filterBy)
                return yield getBestSellingProducts(pageInfo, conditions);
        }
        const count = yield models_1.productModel.countDocuments(conditions);
        const mongoQuery = models_1.productModel.find(conditions).collation({ locale: "en" });
        let docs = [];
        if (pageInfo)
            docs = yield _populateProduct(mongoQuery.skip(pageInfo.skip).limit(pageInfo.pageSize), queryParams);
        else
            docs = yield _populateProduct(mongoQuery, queryParams);
        return utils_1.helper.makePaginatedData(_sortVariantsByProducts(docs, interfaces_1.UserRole.USER, collectionObj), count, pageInfo);
    }
    catch (error) {
        throw error;
    }
});
/**
 * update product status handler
 */
const updateProductStatus = (req, productIdOrSlug, status) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let product = yield models_1.productModel.findOne(checkProductIdOrSlug({}, productIdOrSlug));
        if (!product)
            throw utils_1.helper.buildError("No product found with this id", 404);
        const productObj = product.toJSON();
        const userObj = req.user.toJSON();
        if (![interfaces_1.UserRole.ADMIN, interfaces_1.UserRole.SUPER_ADMIN].includes(userObj === null || userObj === void 0 ? void 0 : userObj.role)) {
            if (productObj.vendor.toString() != userObj._id.toString())
                throw utils_1.helper.buildError("You can't change status of this product", 400);
            yield product.set({ status }).save();
        }
        else {
            yield product.set({ status }).save();
        }
    }
    catch (error) {
        throw error;
    }
});
/**
 * approve vendor's product by admin handler
 */
const updateVendorProductApprovalStatus = (req, productIdOrSlug, status) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let product = yield models_1.productModel.findOne(checkProductIdOrSlug({}, productIdOrSlug));
        if (!product)
            throw utils_1.helper.buildError("No product found with this id", 404);
        yield product.set({ isApproved: status }).save();
    }
    catch (error) {
        throw error;
    }
});
/**
 * update product featured status by admin handler
 */
const updateProductFeatureStatus = (req, productIdOrSlug, status) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let product = yield models_1.productModel.findOne(checkProductIdOrSlug({}, productIdOrSlug));
        if (!product)
            throw utils_1.helper.buildError("No product found with this id", 404);
        yield product.set({ isFeatured: status }).save();
    }
    catch (error) {
        throw error;
    }
});
/**
 * get collections by products
 */
const getCollectionsByProductId = (productIdOrSlug) => __awaiter(void 0, void 0, void 0, function* () {
    var _o, e_2, _p, _q;
    try {
        let collections = yield models_1.collectionModel.find({ status: true });
        let selectedCollections = [];
        try {
            for (var _r = true, collections_1 = __asyncValues(collections), collections_1_1; collections_1_1 = yield collections_1.next(), _o = collections_1_1.done, !_o;) {
                _q = collections_1_1.value;
                _r = false;
                try {
                    let col = _q;
                    let item = yield _getProductByCollection(col, { _id: productIdOrSlug.toString() });
                    if (item)
                        selectedCollections.push(col);
                }
                finally {
                    _r = true;
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (!_r && !_o && (_p = collections_1.return)) yield _p.call(collections_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return selectedCollections;
    }
    catch (error) {
        throw error;
    }
});
/**
 * add bluk products through xls file
 */
const uploadBulkProducts = (req, products) => { var _a, products_1, products_1_1; return __awaiter(void 0, void 0, void 0, function* () {
    var _b, e_3, _c, _d;
    try {
        products = products.map((p) => {
            p.variants = lodash_1.default.sortBy(p.variants, ["variant.price"]);
            return p;
        });
        // not using insert many because mongoose slug updater not supported
        let uploaded = [];
        try {
            for (_a = true, products_1 = __asyncValues(products); products_1_1 = yield products_1.next(), _b = products_1_1.done, !_b;) {
                _d = products_1_1.value;
                _a = false;
                try {
                    let p = _d;
                    uploaded.push(yield models_1.productModel.create(p));
                }
                finally {
                    _a = true;
                }
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (!_a && !_b && (_c = products_1.return)) yield _c.call(products_1);
            }
            finally { if (e_3) throw e_3.error; }
        }
        return uploaded;
    }
    catch (error) {
        throw error;
    }
}); };
/**
 * find High Rated Products
 */
const fetchHighRatedProducts = (queryParams) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let condition = { status: true, rating: { $gt: 0 } };
        let query = models_1.productModel.find(condition).sort({ rating: -1 });
        let count = yield models_1.productModel.countDocuments(condition);
        let pageInfo = utils_1.helper.checkPagination(queryParams);
        let docs = [];
        if (pageInfo)
            docs = yield query.skip(pageInfo.skip).limit(pageInfo.pageSize);
        else
            docs = yield query;
        return utils_1.helper.makePaginatedData(_sortVariantsByProducts(docs, interfaces_1.UserRole.USER), count, pageInfo);
    }
    catch (error) {
        throw error;
    }
});
/**
 * find High views Products
 */
const fetchHighViewsProducts = (queryParams) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let condition = { status: true, viewCount: { $gt: 0 } };
        let query = models_1.productModel.find(condition).sort({ viewCount: -1 });
        let count = yield models_1.productModel.countDocuments(condition);
        let pageInfo = utils_1.helper.checkPagination(queryParams);
        let docs = [];
        if (pageInfo)
            docs = yield query.skip(pageInfo.skip).limit(pageInfo.pageSize);
        else
            docs = yield query;
        return utils_1.helper.makePaginatedData(_sortVariantsByProducts(docs, interfaces_1.UserRole.USER), count, pageInfo);
    }
    catch (error) {
        throw error;
    }
});
/**
 * find Home Page Products
 */
const fetchHomePageProducts = (pType, queryParams) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (pType == interfaces_1.HomeProduct.HIGH_RATED)
            return yield fetchHighRatedProducts(queryParams);
        if (pType == interfaces_1.HomeProduct.HIGH_VIEWS)
            return yield fetchHighViewsProducts(queryParams);
    }
    catch (error) {
        throw error;
    }
});
/**
 * fetch products for compare
 */
const fetchCompareProduct = (fromProduct, toProduct) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let datafromProduct = yield getProduct(fromProduct, {});
        let datatoProduct = yield getProduct(toProduct, {});
        return [datafromProduct, datatoProduct];
    }
    catch (error) {
        throw error;
    }
});
/**
 * fetch top selling product
 */
const fetchTopSellingProduct = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let orders = yield models_1.orderModel.aggregate([
            // { $match: { currentOrderStatus: OrderStatus.DELIVERED } },
            { $limit: 5 },
        ]);
        let pIds = [];
        for (let order of orders) {
            for (let p of order.items) {
                if (!pIds.includes(p.product.toString()))
                    pIds.push(p.product.toString());
            }
        }
        let conditions = {};
        if (pIds.length)
            conditions._id = { $in: pIds };
        return yield models_1.productModel.find(conditions).sort({ updatedAt: -1 }).limit(5);
    }
    catch (error) {
        throw error;
    }
});
const updateProductRating = (productId, adminRating) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let product = yield models_1.productModel.findOne({ _id: productId });
        if (!product)
            throw utils_1.helper.buildError("no product found with this id", 404);
        yield product.set({ adminRating }).save();
    }
    catch (error) {
        throw error;
    }
});
const downloadProductFileSample = (type, cb) => __awaiter(void 0, void 0, void 0, function* () {
    let path;
    if (type == "CSV")
        path = utils_1.helper.buildPath("public", "examples", "products.csv");
    else
        path = utils_1.helper.buildPath("public", "examples", "products.xls");
    cb(path);
});
const downloadAllProducts = () => __awaiter(void 0, void 0, void 0, function* () {
    let products = yield models_1.productModel.find({}).lean();
    const csvFields = [
        "Product Name",
        "Product Description",
        "Images",
        "Meta Description",
        "Tags",
        "Variant Selling Price",
        "Variant MRP",
        "Badal Dalo Price",
        "Variant Quantity",
        "Variant SKU",
        "Color",
        "Size",
    ];
    // { csvFields }
    const csvParser = new json2csv_1.Parser({ fields: csvFields });
    let jsonProducts = [];
    for (let p of products) {
        let obj = {
            "Product Name": p.name,
            "Product Description": p.description,
            Images: ((p === null || p === void 0 ? void 0 : p.images) || []).join(","),
            "Meta Description": p.metaDescription,
            Tags: ((p === null || p === void 0 ? void 0 : p.tags) || []).join(","),
            "Variant Selling Price": 0,
            "Variant MRP": 0,
            "Badal Dalo Price": 0,
            "Variant Quantity": 0,
            "Variant SKU": "",
        };
        for (let vr of p.variants) {
            let v = vr.variant;
            obj["Variant Selling Price"] = (v === null || v === void 0 ? void 0 : v.sellingPrice) || 0;
            obj["Variant MRP"] = (v === null || v === void 0 ? void 0 : v.mrp) || 0;
            obj["Badal Dalo Price"] = (v === null || v === void 0 ? void 0 : v.badalDaloPrice) || 0;
            obj["Variant Quantity"] = (v === null || v === void 0 ? void 0 : v.quantity) || 0;
            obj["Variant SKU"] = v === null || v === void 0 ? void 0 : v.SKU;
            for (let vInfo in v) {
                if (!["quantity", "sellingPrice", "mrp", "badalDaloPrice", "SKU", "deleted"].includes(vInfo)) {
                    obj[vInfo] = v[vInfo];
                }
            }
            jsonProducts.push(Object.assign({}, obj));
        }
    }
    let csvData = csvParser.parse(jsonProducts);
    return csvData;
});
exports.default = {
    findProduct,
    addProduct,
    updateProduct,
    deleteProduct,
    getProduct,
    addProductByAdmin,
    updateProductByAdmin,
    getProductByAdmin,
    getProductByVendor,
    getProducts,
    getProductsByAdmin,
    getProductsByVendor,
    getProductsByCollection,
    updateProductStatus,
    deleteProductImage,
    updateVendorProductApprovalStatus,
    uploadBulkProducts,
    getCollectionsByProductId,
    updateProductFeatureStatus,
    fetchHighRatedProducts,
    fetchHighViewsProducts,
    fetchHomePageProducts,
    fetchCompareProduct,
    updateProductRating,
    downloadProductFileSample,
    fetchTopSellingProduct,
    searchProducts,
    downloadAllProducts,
};
