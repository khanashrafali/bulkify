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
const csv_parser_1 = __importDefault(require("csv-parser"));
const express_validator_1 = require("express-validator");
const fs_1 = __importDefault(require("fs"));
const node_xlsx_1 = __importDefault(require("node-xlsx"));
const validator_1 = __importDefault(require("validator"));
const models_1 = require("../../models");
const utils_1 = require("../../utils");
const interfaces_1 = require("../../utils/interfaces");
const checkDuplicateProduct = (val, { req }) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let conditions = {
        "variants.variant.SKU": { $regex: utils_1.helper.regxEscape(val), $options: "i" },
    };
    let pId = (_a = req.params) === null || _a === void 0 ? void 0 : _a.productIdOrSlug;
    if (pId) {
        validator_1.default.isMongoId(pId)
            ? (conditions._id = { $ne: pId })
            : (conditions.slug = { $ne: pId });
    }
    const product = yield models_1.productModel.findOne(conditions);
    if (product)
        throw utils_1.helper.buildError("Same product SKU already exists", 400);
});
const checkVendor = (val, { req }) => __awaiter(void 0, void 0, void 0, function* () {
    let vendor = yield models_1.vendorModel.findOne({ _id: val });
    if (!vendor)
        throw utils_1.helper.buildError("No vendor found with this id", 404);
});
const postAddProduct = [
    // body("images", "Images should not be empty").isArray({ min: 1 }),
    // body("images.*", "Images should not be empty").trim().notEmpty().isURL(),
    (0, express_validator_1.body)("name", "Please enter valid name").exists().trim().notEmpty(),
    (0, express_validator_1.body)("description", "Please enter valid description")
        .exists()
        .trim()
        .notEmpty(),
    (0, express_validator_1.body)("status", "Please enter valid status like true, false")
        .exists()
        .trim()
        .isIn(["true", "false"])
        .toBoolean(),
    (0, express_validator_1.body)("variants", "Please enter valid variants").exists().isArray({ min: 1 }),
    (0, express_validator_1.body)("metaDescription", "Please enter valid meta description")
        .exists()
        .trim()
        .notEmpty(),
    // body("variants.*.size", "Please enter valid variant's size").exists(),
    // body("variants.*.color", "Please enter valid variant's color").exists(),
    // body("variants.*.material", "Please enter valid variant's material").exists(),
    (0, express_validator_1.body)("variants.*.variant.SKU", "Please enter valid variant's SKU")
        .exists()
        .trim()
        .isAlphanumeric("en-IN")
        .withMessage("SKU must be alphanumeric")
        .custom(checkDuplicateProduct),
    (0, express_validator_1.body)("variants.*.variant.mrp", "Please enter valid variant's mrp")
        .exists()
        .isFloat({ gt: -1 }),
    (0, express_validator_1.body)("variants.*.variant.sellingPrice", "Please enter valid variant's sellingPrice")
        .exists()
        .isFloat({ gt: -1, lt: 1000000000 }),
    // body("variants.*.variant.badalDaloPrice", "Please enter valid variant's badalDaloPrice").exists().isFloat({ gt: -1 }),
    (0, express_validator_1.body)("variants.*.variant.quantity", "Please enter valid variant's quantity")
        .exists()
        .isInt(),
    (0, express_validator_1.body)("variants.*.variant.deleted", "Please enter valid variant's deleted")
        .exists()
        .isBoolean(),
    (0, express_validator_1.body)("brand", "Please enter valid brand")
        .optional({ nullable: true })
        .isMongoId(),
    (0, express_validator_1.body)("category", "Please enter valid category").exists().isMongoId(),
    (0, express_validator_1.body)("subCategory", "Please enter valid subCategory")
        .optional({ nullable: true })
        .isMongoId(),
    // body("subCategories", "Please enter valid sub Categories").exists().isArray(),
    // body("subCategories.*", "Please enter valid sub Category id").optional().isMongoId(),
    // body("mainCategories", "Please enter valid main Categories").exists().isArray(),
    // body("mainCategories.*", "Please enter valid sub Category id").optional().isMongoId(),
    // body("tags", "Please enter valid tags").exists().isArray(),
    (0, express_validator_1.body)("warranty", "Please enter valid warranty").optional().trim(),
];
const postAddProductByAdmin = [
    ...postAddProduct,
    // body("vendor", "Please enter valid vendor").exists().isMongoId().bail().custom(checkVendor),
];
const getProduct = [
    (0, express_validator_1.param)("productIdOrSlug", "Please enter valid product Id/slug")
        .exists()
        .trim()
        .notEmpty()
        .custom((val, { req }) => __awaiter(void 0, void 0, void 0, function* () {
        let conditions = {};
        validator_1.default.isMongoId(val)
            ? (conditions._id = val)
            : (conditions.slug = val);
        const product = yield models_1.productModel.findOne(conditions);
        if (!product)
            throw utils_1.helper.buildError("no product found with this id/slug", 404);
    })),
];
const putUpdateProduct = [...getProduct, ...postAddProduct];
const putUpdateProductByAdmin = [...getProduct, ...postAddProductByAdmin];
const getProducts = [
    (0, express_validator_1.query)("filterBy", `Please enter valid filterBy like ${utils_1.CONSTANT.FILTER_DROPDOWN.map((v) => v.key).join(",")}`)
        .optional()
        .isIn(utils_1.CONSTANT.FILTER_DROPDOWN.map((v) => v.key)),
    (0, express_validator_1.query)("isApproved", `Please enter valid isApproved like ${utils_1.CONSTANT.APPROVAL_STATUS.join(",")}`)
        .optional()
        .isIn(utils_1.CONSTANT.APPROVAL_STATUS),
    (0, express_validator_1.query)("type", `Please enter valid type like ${utils_1.CONSTANT.PRODUCT_TYPE.join(",")}`)
        .optional()
        .isIn(utils_1.CONSTANT.PRODUCT_TYPE),
    (0, express_validator_1.query)("vendor", "Please enter valid vendor").optional().isMongoId(),
    (0, express_validator_1.query)("createdAt", "Please enter valid createdAt")
        .optional()
        .isDate({ format: utils_1.CONSTANT.DATE }),
    (0, express_validator_1.query)("status", "Please enter valid status")
        .optional()
        .isIn(["true", "false"])
        .toBoolean(),
    (0, express_validator_1.query)("page", "Please enter valid page").optional().toInt().isInt({ gt: 0 }),
    (0, express_validator_1.query)("pageSize", "Please enter valid pageSize")
        .optional()
        .toInt()
        .isInt({ gt: 0 }),
    (0, express_validator_1.query)("pageSize", "Please enter valid pageSize")
        .optional()
        .toInt()
        .isInt({ gt: 0 }),
    (0, express_validator_1.query)("category", "Please enter valid category").optional().isMongoId(),
];
const searchProducts = [
    (0, express_validator_1.body)("filterBy", `Please enter valid filterBy like ${utils_1.CONSTANT.FILTER_DROPDOWN.map((v) => v.key).join(",")}`)
        .optional()
        .isIn(utils_1.CONSTANT.FILTER_DROPDOWN.map((v) => v.key)),
    (0, express_validator_1.body)("isApproved", `Please enter valid isApproved like ${utils_1.CONSTANT.APPROVAL_STATUS.join(",")}`)
        .optional()
        .isIn(utils_1.CONSTANT.APPROVAL_STATUS),
    (0, express_validator_1.body)("type", `Please enter valid type like ${utils_1.CONSTANT.PRODUCT_TYPE.join(",")}`)
        .optional()
        .isIn(utils_1.CONSTANT.PRODUCT_TYPE),
    (0, express_validator_1.body)("vendor", "Please enter valid vendor").optional().isMongoId(),
    (0, express_validator_1.body)("createdAt", "Please enter valid createdAt")
        .optional()
        .isDate({ format: utils_1.CONSTANT.DATE }),
    (0, express_validator_1.body)("status", "Please enter valid status")
        .optional()
        .isIn(["true", "false"])
        .toBoolean(),
    (0, express_validator_1.body)("page", "Please enter valid page").optional().toInt().isInt({ gt: 0 }),
    (0, express_validator_1.body)("pageSize", "Please enter valid pageSize")
        .optional()
        .toInt()
        .isInt({ gt: 0 }),
];
const getProductsByCollection = [
    (0, express_validator_1.param)("collectionIdOrSlug", "Please enter valid collectionIdOrSlug").exists(),
    (0, express_validator_1.query)("filterBy", `Please enter valid filterBy like ${utils_1.CONSTANT.FILTER_DROPDOWN.map((v) => v.key).join(",")}`)
        .optional()
        .isIn(utils_1.CONSTANT.FILTER_DROPDOWN.map((v) => v.key)),
    (0, express_validator_1.query)("isApproved", `Please enter valid isApproved like ${utils_1.CONSTANT.APPROVAL_STATUS.join(",")}`)
        .optional()
        .isIn(utils_1.CONSTANT.APPROVAL_STATUS),
    (0, express_validator_1.query)("type", `Please enter valid type like ${utils_1.CONSTANT.PRODUCT_TYPE.join(",")}`)
        .optional()
        .isIn(utils_1.CONSTANT.PRODUCT_TYPE),
    (0, express_validator_1.query)("vendor", "Please enter valid vendor").optional().isMongoId(),
    (0, express_validator_1.query)("createdAt", "Please enter valid createdAt")
        .optional()
        .isDate({ format: utils_1.CONSTANT.DATE }),
    (0, express_validator_1.query)("status", "Please enter valid status")
        .optional()
        .isIn(["true", "false"])
        .toBoolean(),
    (0, express_validator_1.query)("page", "Please enter valid page").optional().toInt().isInt({ gt: 0 }),
    (0, express_validator_1.query)("pageSize", "Please enter valid pageSize")
        .optional()
        .toInt()
        .isInt({ gt: 0 }),
];
const patchUpdateProductStatus = [
    (0, express_validator_1.param)("productIdOrSlug", "Please enter valid productIdOrSlug")
        .exists()
        .notEmpty(),
    (0, express_validator_1.body)("status", "Please enter valid status like true, false")
        .exists()
        .isBoolean(),
];
const patchUpdateProductFeatureStatus = [
    (0, express_validator_1.param)("productIdOrSlug", "Please enter valid productIdOrSlug")
        .exists()
        .notEmpty(),
    (0, express_validator_1.body)("isFeatured", "Please enter valid isFeatured like true, false")
        .exists()
        .isBoolean(),
];
const deleteProductImage = [
    (0, express_validator_1.param)("productIdOrSlug", "Please enter valid productIdOrSlug")
        .exists()
        .notEmpty(),
    (0, express_validator_1.body)("urls", "Please enter valid urls").exists().isArray({ min: 1 }),
    (0, express_validator_1.body)("urls.*", "Please enter valid urls").exists().isURL(),
];
const patchUpdateVendorProductApprovalStatus = [
    (0, express_validator_1.param)("productIdOrSlug", "Please enter valid productIdOrSlug")
        .exists()
        .notEmpty(),
    (0, express_validator_1.body)("status", `Please enter valid status like ${utils_1.CONSTANT.APPROVAL_STATUS.join(",")}`)
        .exists()
        .isIn(utils_1.CONSTANT.APPROVAL_STATUS),
];
const setProductData = (userId, productsData, category, subCategory, brand, variantsInfo) => {
    var _a, _b, _c, _d, _e;
    let products = [];
    let rowNo = 0;
    for (let p of productsData) {
        rowNo++;
        let variant = {
            badalDaloPrice: +(p["Badal Dalo Price"] || 0),
            sellingPrice: +p["Variant Selling Price"],
            mrp: +p["Variant MRP"],
            quantity: +p["Variant Quantity"],
            SKU: p["Variant SKU"],
        };
        let isStart = false;
        let colNo = 10;
        for (let k in p) {
            if (k == "Variant SKU") {
                isStart = true;
                continue;
            }
            let pkVal = p[k];
            if (isStart && ((_a = pkVal === null || pkVal === void 0 ? void 0 : pkVal.trim()) === null || _a === void 0 ? void 0 : _a.length)) {
                colNo++;
                let newKey = k;
                newKey = newKey === null || newKey === void 0 ? void 0 : newKey.toLowerCase();
                let vInfo = variantsInfo.find((v) => {
                    var _a;
                    return ((_a = v.slug) === null || _a === void 0 ? void 0 : _a.toLowerCase().trim()) == (newKey === null || newKey === void 0 ? void 0 : newKey.toLowerCase().trim());
                });
                if (!vInfo) {
                    throw utils_1.helper.buildError(`Row/Col ${rowNo}/${colNo} - ${k} variant key not allowed in ${category.name} category`, 404);
                }
                let vValue = vInfo.values.find((v) => (v === null || v === void 0 ? void 0 : v.toLowerCase().trim()) == pkVal.toLowerCase().trim());
                if (!vValue && ((_b = pkVal.toLowerCase().trim()) === null || _b === void 0 ? void 0 : _b.length)) {
                    throw utils_1.helper.buildError(`Row/Col ${rowNo}/${colNo} - ${k}/${pkVal} provide valid variant value`, 404);
                }
                variant[newKey] = (_c = p[k]) === null || _c === void 0 ? void 0 : _c.trim();
            }
        }
        let images = (_e = (_d = p["Images"]) === null || _d === void 0 ? void 0 : _d.split(",")) === null || _e === void 0 ? void 0 : _e.filter((v) => v.length > 1);
        let existingProductIndex = products.findIndex((e) => e.name === p["Product Name"]);
        if (existingProductIndex >= 0) {
            products[existingProductIndex].variants.push({ variant });
        }
        else {
            products.push({
                name: p["Product Name"],
                description: p["Product Description"],
                images: images || [],
                vendor: userId,
                status: true,
                variants: [{ variant }],
                metaDescription: p["Meta Description"],
                // tags: (p["Tags"] as string)?.trim()?.split(","),
                isApproved: interfaces_1.ApprovalStatus.APPROVED,
                brand,
                category: category._id,
                subCategory,
                // subCategories: childCategory?.length ? [childCategory] : [],
            });
        }
    }
    return products;
};
const parseDataFromXls = (ireq, filePath, userToJson, category, subCategory, brand, variantData) => __awaiter(void 0, void 0, void 0, function* () {
    let data = node_xlsx_1.default.parse(filePath);
    yield utils_1.fileHandler.deleteFile(filePath);
    if (userToJson.role == interfaces_1.UserRole.VENDOR) {
        // if (!userToJson.isVendorProfileComplete) throw helper.buildError("Please complete your profile", 400);
        if (userToJson.isApproved != interfaces_1.ApprovalStatus.APPROVED) {
            throw utils_1.helper.buildError("Can't upload product because your profile is not approved", 400);
        }
    }
    if (data[0].name.toString() != "PRODUCTS")
        throw utils_1.helper.buildError("invalid file Data", 400);
    let columns = data[0].data.filter((v, i) => i == 0)[0] || [];
    let products = data[0].data.filter((v, i) => i !== 0);
    if (products.length <= 0)
        throw utils_1.helper.buildError("Please enter valid products", 400);
    let productOBJS = [];
    let dataPros = [];
    for (let i = 0; i < products.length; i++) {
        let obj = {};
        for (let j = 0; j < columns.length; j++)
            obj[columns[j]] = products[i][j];
        dataPros.push(obj);
    }
    return setProductData(ireq.user._id, dataPros, category, subCategory, brand, variantData);
});
const parseDataFromCsv = (ireq, filePath, userToJson, category, subCategory, brand, variantData) => __awaiter(void 0, void 0, void 0, function* () {
    // if (!userToJson.isProfileComplete) throw helper.buildError("Please complete your profile", 400);
    if (userToJson.isApproved != interfaces_1.ApprovalStatus.APPROVED) {
        throw utils_1.helper.buildError("Can't upload product because your profile is not approved", 400);
    }
    let csvToJson = [];
    yield new Promise((res, rej) => {
        fs_1.default.createReadStream(filePath)
            .pipe((0, csv_parser_1.default)())
            .on("data", (data) => csvToJson.push(data))
            .on("end", () => {
            res(csvToJson);
        });
    });
    yield utils_1.fileHandler.deleteFile(filePath);
    return setProductData(ireq.user._id, csvToJson, category, subCategory, brand, variantData);
});
const validateParseProducts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c, _d, _e, _f;
    try {
        utils_1.helper.checkPayloadFiles(req);
        const ireq = req;
        const filePath = (_b = req === null || req === void 0 ? void 0 : req.file) === null || _b === void 0 ? void 0 : _b.path;
        const fileName = (_c = req.file) === null || _c === void 0 ? void 0 : _c.originalname;
        let userToJson = ireq.user.toJSON();
        if (!filePath)
            return;
        let category = yield models_1.categoryModel
            .findOne({ _id: req.body.category })
            .lean();
        if (!category) {
            throw utils_1.helper.buildError("no category found with this cat id", 404);
        }
        let variantData = yield models_1.variantModel
            .find({ categories: { $in: [req.body.category] } })
            .lean();
        if (!(variantData === null || variantData === void 0 ? void 0 : variantData.length)) {
            throw utils_1.helper.buildError("no variant data found with this cat id", 404);
        }
        if (((_d = req === null || req === void 0 ? void 0 : req.file) === null || _d === void 0 ? void 0 : _d.mimetype) == "text/csv" || (fileName === null || fileName === void 0 ? void 0 : fileName.includes(".csv"))) {
            req.body.productOBJS = yield parseDataFromCsv(ireq, filePath, userToJson, category, req.body.subCategory, req.body.brand, variantData);
        }
        else if (((_e = req === null || req === void 0 ? void 0 : req.file) === null || _e === void 0 ? void 0 : _e.mimetype) == "application/vnd.ms-excel" ||
            (fileName === null || fileName === void 0 ? void 0 : fileName.includes(".xls"))) {
            req.body.productOBJS = yield parseDataFromXls(ireq, filePath, userToJson, category, req.body.subCategory, req.body.brand, variantData);
        }
        else
            throw utils_1.helper.buildError("please enter valid file like xls,csv", 400);
        next();
    }
    catch (error) {
        if (req === null || req === void 0 ? void 0 : req.file)
            yield utils_1.fileHandler.deleteFile((_f = req === null || req === void 0 ? void 0 : req.file) === null || _f === void 0 ? void 0 : _f.path);
        next(error);
    }
});
const postBulkUpload = [
    (0, express_validator_1.body)("productOBJS.*.images", "Images should not be empty").isArray(),
    (0, express_validator_1.body)("productOBJS.*.images.*", "Images should not be empty")
        .trim()
        .notEmpty()
        .isURL(),
    (0, express_validator_1.body)("productOBJS.*.name", "Please enter valid product name")
        .exists()
        .trim()
        .notEmpty()
        .custom(checkDuplicateProduct),
    (0, express_validator_1.body)("productOBJS.*.description", "Please enter valid product description")
        .exists()
        .trim()
        .notEmpty(),
    (0, express_validator_1.body)("productOBJS.*.brand", "Please enter valid product brand")
        .optional()
        .isMongoId(),
    (0, express_validator_1.body)("productOBJS.*.category", "Please enter valid product category")
        .optional()
        .trim()
        .isMongoId(),
    (0, express_validator_1.body)("productOBJS.*.subCategory", "Please enter valid product subCategory")
        .optional()
        .isMongoId(),
    (0, express_validator_1.body)("productOBJS.*.vendor", "Please enter valid product vendor").exists(),
    (0, express_validator_1.body)("productOBJS.*.variants", "Please enter valid variants")
        .exists()
        .isArray({ min: 1 }),
    // body("productOBJS.*.variants.*.size", "Please enter valid variant's size").exists(),
    // body("productOBJS.*.variants.*.color", "Please enter valid variant's color").exists(),
    // body("productOBJS.*.variants.*.material", "Please enter valid variant's material").exists(),
    (0, express_validator_1.body)("productOBJS.*.variants.*.variant.SKU", "Please enter valid variant's SKU")
        .exists()
        .trim()
        .isAlphanumeric("en-IN")
        .withMessage("SKU must be alphanumeric"),
    // body("productOBJS.*.variants.*.variant.badalDaloPrice", "Please enter valid variant's Badal Dalo Price")
    //   .exists()
    //   .toFloat()
    //   .isFloat({ gt: -1 }),
    (0, express_validator_1.body)("productOBJS.*.variants.*.variant.mrp", "Please enter valid variant's mrp")
        .exists()
        .toFloat()
        .isFloat({ gt: -1 }),
    (0, express_validator_1.body)("productOBJS.*.variants.*.variant.sellingPrice", "Please enter valid variant's sellingPrice")
        .exists()
        .toFloat()
        .isFloat({ gt: -1, lt: 1000000000 }),
    (0, express_validator_1.body)("productOBJS.*.variants.*.variant.quantity", "Please enter valid variant's quantity")
        .exists()
        .toInt()
        .isInt({ gt: -1 }),
];
const getHomePageProducts = [
    (0, express_validator_1.param)("type", `Please enter valid type like ${utils_1.CONSTANT.HOME_PAGE_PRODUCTS.join(",")}`)
        .exists()
        .isIn(utils_1.CONSTANT.HOME_PAGE_PRODUCTS),
];
const fetchCompareProduct = [
    (0, express_validator_1.query)("from", "Please enter valid from").exists().isMongoId(),
    (0, express_validator_1.query)("to", "Please enter valid to").exists().isMongoId(),
];
const downloadProductFileSample = [
    (0, express_validator_1.param)("type", "Please enter valid type like CSV, XLS")
        .exists()
        .isIn(["CSV", "XLS"]),
];
exports.default = {
    postAddProduct,
    putUpdateProduct,
    getProduct,
    getProductsByCollection,
    patchUpdateProductStatus,
    deleteProductImage,
    patchUpdateVendorProductApprovalStatus,
    getProducts,
    validateParseProducts,
    postBulkUpload,
    patchUpdateProductFeatureStatus,
    getHomePageProducts,
    postAddProductByAdmin,
    putUpdateProductByAdmin,
    fetchCompareProduct,
    downloadProductFileSample,
    searchProducts,
};
