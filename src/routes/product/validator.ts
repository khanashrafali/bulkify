import csv from "csv-parser";
import { NextFunction, Request, Response } from "express";
import { body, CustomValidator, param, query } from "express-validator";
import fs from "fs";
import xls from "node-xlsx";
import validator from "validator";
import {
  categoryModel,
  productModel,
  variantModel,
  vendorModel,
} from "../../models";
import { CONSTANT, fileHandler, helper } from "../../utils";
import { ApprovalStatus, IRequest, UserRole } from "../../utils/interfaces";

const checkDuplicateProduct: CustomValidator = async (val, { req }) => {
  let conditions: any = {
    "variants.variant.SKU": { $regex: helper.regxEscape(val), $options: "i" },
  };
  let pId = req.params?.productIdOrSlug;
  if (pId) {
    validator.isMongoId(pId)
      ? (conditions._id = { $ne: pId })
      : (conditions.slug = { $ne: pId });
  }
  const product = await productModel.findOne(conditions);
  if (product) throw helper.buildError("Same product SKU already exists", 400);
};

const checkVendor: CustomValidator = async (val, { req }) => {
  let vendor = await vendorModel.findOne({ _id: val });
  if (!vendor) throw helper.buildError("No vendor found with this id", 404);
};

const postAddProduct: any[] = [
  // body("images", "Images should not be empty").isArray({ min: 1 }),
  // body("images.*", "Images should not be empty").trim().notEmpty().isURL(),
  body("name", "Please enter valid name").exists().trim().notEmpty(),
  body("description", "Please enter valid description")
    .exists()
    .trim()
    .notEmpty(),
  body("status", "Please enter valid status like true, false")
    .exists()
    .trim()
    .isIn(["true", "false"])
    .toBoolean(),
  body("variants", "Please enter valid variants").exists().isArray({ min: 1 }),
  body("metaDescription", "Please enter valid meta description")
    .exists()
    .trim()
    .notEmpty(),
  // body("variants.*.size", "Please enter valid variant's size").exists(),
  // body("variants.*.color", "Please enter valid variant's color").exists(),
  // body("variants.*.material", "Please enter valid variant's material").exists(),
  body("variants.*.variant.SKU", "Please enter valid variant's SKU")
    .exists()
    .trim()
    .isAlphanumeric("en-IN")
    .withMessage("SKU must be alphanumeric")
    .custom(checkDuplicateProduct),
  body("variants.*.variant.mrp", "Please enter valid variant's mrp")
    .exists()
    .isFloat({ gt: -1 }),
  body(
    "variants.*.variant.sellingPrice",
    "Please enter valid variant's sellingPrice"
  )
    .exists()
    .isFloat({ gt: -1, lt: 1000000000 }),
  // body("variants.*.variant.badalDaloPrice", "Please enter valid variant's badalDaloPrice").exists().isFloat({ gt: -1 }),
  body("variants.*.variant.quantity", "Please enter valid variant's quantity")
    .exists()
    .isInt(),
  body("variants.*.variant.deleted", "Please enter valid variant's deleted")
    .exists()
    .isBoolean(),
  body("brand", "Please enter valid brand")
    .optional({ nullable: true })
    .isMongoId(),
  body("category", "Please enter valid category").exists().isMongoId(),
  body("subCategory", "Please enter valid subCategory")
    .optional({ nullable: true })
    .isMongoId(),
  // body("subCategories", "Please enter valid sub Categories").exists().isArray(),
  // body("subCategories.*", "Please enter valid sub Category id").optional().isMongoId(),
  // body("mainCategories", "Please enter valid main Categories").exists().isArray(),
  // body("mainCategories.*", "Please enter valid sub Category id").optional().isMongoId(),
  // body("tags", "Please enter valid tags").exists().isArray(),
  body("warranty", "Please enter valid warranty").optional().trim(),
];

const postAddProductByAdmin: any[] = [
  ...postAddProduct,
  // body("vendor", "Please enter valid vendor").exists().isMongoId().bail().custom(checkVendor),
];

const getProduct = [
  param("productIdOrSlug", "Please enter valid product Id/slug")
    .exists()
    .trim()
    .notEmpty()
    .custom(async (val, { req }) => {
      let conditions: any = {};
      validator.isMongoId(val)
        ? (conditions._id = val)
        : (conditions.slug = val);
      const product = await productModel.findOne(conditions);
      if (!product)
        throw helper.buildError("no product found with this id/slug", 404);
    }),
];

const putUpdateProduct: any[] = [...getProduct, ...postAddProduct];

const putUpdateProductByAdmin = [...getProduct, ...postAddProductByAdmin];

const getProducts = [
  query(
    "filterBy",
    `Please enter valid filterBy like ${CONSTANT.FILTER_DROPDOWN.map(
      (v) => v.key
    ).join(",")}`
  )
    .optional()
    .isIn(CONSTANT.FILTER_DROPDOWN.map((v) => v.key)),
  query(
    "isApproved",
    `Please enter valid isApproved like ${CONSTANT.APPROVAL_STATUS.join(",")}`
  )
    .optional()
    .isIn(CONSTANT.APPROVAL_STATUS),
  query(
    "type",
    `Please enter valid type like ${CONSTANT.PRODUCT_TYPE.join(",")}`
  )
    .optional()
    .isIn(CONSTANT.PRODUCT_TYPE),
  query("vendor", "Please enter valid vendor").optional().isMongoId(),
  query("createdAt", "Please enter valid createdAt")
    .optional()
    .isDate({ format: CONSTANT.DATE }),
  query("status", "Please enter valid status")
    .optional()
    .isIn(["true", "false"])
    .toBoolean(),
  query("page", "Please enter valid page").optional().toInt().isInt({ gt: 0 }),
  query("pageSize", "Please enter valid pageSize")
    .optional()
    .toInt()
    .isInt({ gt: 0 }),
  query("pageSize", "Please enter valid pageSize")
    .optional()
    .toInt()
    .isInt({ gt: 0 }),
  query("category", "Please enter valid category").optional().isMongoId(),
];

const searchProducts = [
  body(
    "filterBy",
    `Please enter valid filterBy like ${CONSTANT.FILTER_DROPDOWN.map(
      (v) => v.key
    ).join(",")}`
  )
    .optional()
    .isIn(CONSTANT.FILTER_DROPDOWN.map((v) => v.key)),
  body(
    "isApproved",
    `Please enter valid isApproved like ${CONSTANT.APPROVAL_STATUS.join(",")}`
  )
    .optional()
    .isIn(CONSTANT.APPROVAL_STATUS),
  body(
    "type",
    `Please enter valid type like ${CONSTANT.PRODUCT_TYPE.join(",")}`
  )
    .optional()
    .isIn(CONSTANT.PRODUCT_TYPE),
  body("vendor", "Please enter valid vendor").optional().isMongoId(),
  body("createdAt", "Please enter valid createdAt")
    .optional()
    .isDate({ format: CONSTANT.DATE }),
  body("status", "Please enter valid status")
    .optional()
    .isIn(["true", "false"])
    .toBoolean(),
  body("page", "Please enter valid page").optional().toInt().isInt({ gt: 0 }),
  body("pageSize", "Please enter valid pageSize")
    .optional()
    .toInt()
    .isInt({ gt: 0 }),
];

const getProductsByCollection = [
  param("collectionIdOrSlug", "Please enter valid collectionIdOrSlug").exists(),
  query(
    "filterBy",
    `Please enter valid filterBy like ${CONSTANT.FILTER_DROPDOWN.map(
      (v) => v.key
    ).join(",")}`
  )
    .optional()
    .isIn(CONSTANT.FILTER_DROPDOWN.map((v) => v.key)),
  query(
    "isApproved",
    `Please enter valid isApproved like ${CONSTANT.APPROVAL_STATUS.join(",")}`
  )
    .optional()
    .isIn(CONSTANT.APPROVAL_STATUS),
  query(
    "type",
    `Please enter valid type like ${CONSTANT.PRODUCT_TYPE.join(",")}`
  )
    .optional()
    .isIn(CONSTANT.PRODUCT_TYPE),
  query("vendor", "Please enter valid vendor").optional().isMongoId(),
  query("createdAt", "Please enter valid createdAt")
    .optional()
    .isDate({ format: CONSTANT.DATE }),
  query("status", "Please enter valid status")
    .optional()
    .isIn(["true", "false"])
    .toBoolean(),
  query("page", "Please enter valid page").optional().toInt().isInt({ gt: 0 }),
  query("pageSize", "Please enter valid pageSize")
    .optional()
    .toInt()
    .isInt({ gt: 0 }),
];

const patchUpdateProductStatus = [
  param("productIdOrSlug", "Please enter valid productIdOrSlug")
    .exists()
    .notEmpty(),
  body("status", "Please enter valid status like true, false")
    .exists()
    .isBoolean(),
];

const patchUpdateProductFeatureStatus = [
  param("productIdOrSlug", "Please enter valid productIdOrSlug")
    .exists()
    .notEmpty(),
  body("isFeatured", "Please enter valid isFeatured like true, false")
    .exists()
    .isBoolean(),
];

const deleteProductImage = [
  param("productIdOrSlug", "Please enter valid productIdOrSlug")
    .exists()
    .notEmpty(),
  body("urls", "Please enter valid urls").exists().isArray({ min: 1 }),
  body("urls.*", "Please enter valid urls").exists().isURL(),
];

const patchUpdateVendorProductApprovalStatus = [
  param("productIdOrSlug", "Please enter valid productIdOrSlug")
    .exists()
    .notEmpty(),
  body(
    "status",
    `Please enter valid status like ${CONSTANT.APPROVAL_STATUS.join(",")}`
  )
    .exists()
    .isIn(CONSTANT.APPROVAL_STATUS),
];

const setProductData = (
  userId: string,
  productsData: any[],
  category: any,
  subCategory: string,
  brand: string,
  variantsInfo: any[]
) => {
  let products: any[] = [];
  let rowNo: number = 0;
  for (let p of productsData) {
    rowNo++;
    let variant: any = {
      badalDaloPrice: +(p["Badal Dalo Price"] || 0),
      sellingPrice: +p["Variant Selling Price"],
      mrp: +p["Variant MRP"],
      quantity: +p["Variant Quantity"],
      SKU: p["Variant SKU"],
    };

    let isStart = false;
    let colNo: number = 10;
    for (let k in p) {
      if (k == "Variant SKU") {
        isStart = true;
        continue;
      }

      let pkVal = p[k];

      if (isStart && pkVal?.trim()?.length) {
        colNo++;

        let newKey = k;
        newKey = newKey?.toLowerCase();

        let vInfo = variantsInfo.find((v) => {
          return v.slug?.toLowerCase().trim() == newKey?.toLowerCase().trim();
        });

        if (!vInfo) {
          throw helper.buildError(
            `Row/Col ${rowNo}/${colNo} - ${k} variant key not allowed in ${category.name} category`,
            404
          );
        }

        let vValue = vInfo.values.find(
          (v: any) => v?.toLowerCase().trim() == pkVal.toLowerCase().trim()
        );
        if (!vValue && pkVal.toLowerCase().trim()?.length) {
          throw helper.buildError(
            `Row/Col ${rowNo}/${colNo} - ${k}/${pkVal} provide valid variant value`,
            404
          );
        }

        variant[newKey] = p[k]?.trim();
      }
    }

    let images = (p["Images"] as string)
      ?.split(",")
      ?.filter((v) => v.length > 1);
    let existingProductIndex = products.findIndex(
      (e) => e.name === p["Product Name"]
    );

    if (existingProductIndex >= 0) {
      products[existingProductIndex].variants.push({ variant });
    } else {
      products.push({
        name: p["Product Name"],
        description: p["Product Description"],
        images: images || [],
        vendor: userId,
        status: true,
        variants: [{ variant }],
        metaDescription: p["Meta Description"],
        // tags: (p["Tags"] as string)?.trim()?.split(","),
        isApproved: ApprovalStatus.APPROVED,
        brand,
        category: category._id,
        subCategory,
        // subCategories: childCategory?.length ? [childCategory] : [],
      });
    }
  }
  return products;
};

const parseDataFromXls = async (
  ireq: IRequest,
  filePath: string,
  userToJson: any,
  category: any,
  subCategory: string,
  brand: string,
  variantData: any[]
) => {
  let data = xls.parse(filePath);
  await fileHandler.deleteFile(filePath);

  if (userToJson.role == UserRole.VENDOR) {
    // if (!userToJson.isVendorProfileComplete) throw helper.buildError("Please complete your profile", 400);

    if (userToJson.isApproved != ApprovalStatus.APPROVED) {
      throw helper.buildError(
        "Can't upload product because your profile is not approved",
        400
      );
    }
  }

  if (data[0].name.toString() != "PRODUCTS")
    throw helper.buildError("invalid file Data", 400);
  let columns: any[] = data[0].data.filter((v, i) => i == 0)[0] || [];
  let products: any[] = data[0].data.filter((v, i) => i !== 0);
  if (products.length <= 0)
    throw helper.buildError("Please enter valid products", 400);
  let productOBJS: any[] = [];

  let dataPros = [];
  for (let i = 0; i < products.length; i++) {
    let obj: any = {};
    for (let j = 0; j < columns.length; j++) obj[columns[j]] = products[i][j];
    dataPros.push(obj);
  }

  return setProductData(
    ireq.user._id,
    dataPros,
    category,
    subCategory,
    brand,
    variantData
  );
};

const parseDataFromCsv = async (
  ireq: IRequest,
  filePath: string,
  userToJson: any,
  category: any,
  subCategory: string,
  brand: string,
  variantData: any[]
) => {
  // if (!userToJson.isProfileComplete) throw helper.buildError("Please complete your profile", 400);

  if (userToJson.isApproved != ApprovalStatus.APPROVED) {
    throw helper.buildError(
      "Can't upload product because your profile is not approved",
      400
    );
  }

  let csvToJson: any[] = [];

  await new Promise((res, rej) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => csvToJson.push(data))
      .on("end", () => {
        res(csvToJson);
      });
  });

  await fileHandler.deleteFile(filePath);

  return setProductData(
    ireq.user._id,
    csvToJson,
    category,
    subCategory,
    brand,
    variantData
  );
};

const validateParseProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    helper.checkPayloadFiles(req);

    const ireq = req as IRequest;
    const filePath = req?.file?.path;
    const fileName = req.file?.originalname;
    let userToJson: any = ireq.user.toJSON();
    if (!filePath) return;

    let category = await categoryModel
      .findOne({ _id: req.body.category })
      .lean();

    if (!category) {
      throw helper.buildError("no category found with this cat id", 404);
    }

    let variantData = await variantModel
      .find({ categories: { $in: [req.body.category] } })
      .lean();

    if (!variantData?.length) {
      throw helper.buildError("no variant data found with this cat id", 404);
    }

    if (req?.file?.mimetype == "text/csv" || fileName?.includes(".csv")) {
      req.body.productOBJS = await parseDataFromCsv(
        ireq,
        filePath,
        userToJson,
        category,
        req.body.subCategory,
        req.body.brand,
        variantData
      );
    } else if (
      req?.file?.mimetype == "application/vnd.ms-excel" ||
      fileName?.includes(".xls")
    ) {
      req.body.productOBJS = await parseDataFromXls(
        ireq,
        filePath,
        userToJson,
        category,
        req.body.subCategory,
        req.body.brand,
        variantData
      );
    } else throw helper.buildError("please enter valid file like xls,csv", 400);

    next();
  } catch (error) {
    if (req?.file) await fileHandler.deleteFile(req?.file?.path);
    next(error);
  }
};

const postBulkUpload: any[] = [
  body("productOBJS.*.images", "Images should not be empty").isArray(),
  body("productOBJS.*.images.*", "Images should not be empty")
    .trim()
    .notEmpty()
    .isURL(),
  body("productOBJS.*.name", "Please enter valid product name")
    .exists()
    .trim()
    .notEmpty()
    .custom(checkDuplicateProduct),
  body("productOBJS.*.description", "Please enter valid product description")
    .exists()
    .trim()
    .notEmpty(),
  body("productOBJS.*.brand", "Please enter valid product brand")
    .optional()
    .isMongoId(),
  body("productOBJS.*.category", "Please enter valid product category")
    .optional()
    .trim()
    .isMongoId(),
  body("productOBJS.*.subCategory", "Please enter valid product subCategory")
    .optional()
    .isMongoId(),
  body("productOBJS.*.vendor", "Please enter valid product vendor").exists(),
  body("productOBJS.*.variants", "Please enter valid variants")
    .exists()
    .isArray({ min: 1 }),
  // body("productOBJS.*.variants.*.size", "Please enter valid variant's size").exists(),
  // body("productOBJS.*.variants.*.color", "Please enter valid variant's color").exists(),
  // body("productOBJS.*.variants.*.material", "Please enter valid variant's material").exists(),
  body(
    "productOBJS.*.variants.*.variant.SKU",
    "Please enter valid variant's SKU"
  )
    .exists()
    .trim()
    .isAlphanumeric("en-IN")
    .withMessage("SKU must be alphanumeric"),
  // body("productOBJS.*.variants.*.variant.badalDaloPrice", "Please enter valid variant's Badal Dalo Price")
  //   .exists()
  //   .toFloat()
  //   .isFloat({ gt: -1 }),
  body(
    "productOBJS.*.variants.*.variant.mrp",
    "Please enter valid variant's mrp"
  )
    .exists()
    .toFloat()
    .isFloat({ gt: -1 }),
  body(
    "productOBJS.*.variants.*.variant.sellingPrice",
    "Please enter valid variant's sellingPrice"
  )
    .exists()
    .toFloat()
    .isFloat({ gt: -1, lt: 1000000000 }),
  body(
    "productOBJS.*.variants.*.variant.quantity",
    "Please enter valid variant's quantity"
  )
    .exists()
    .toInt()
    .isInt({ gt: -1 }),
];

const getHomePageProducts: any[] = [
  param(
    "type",
    `Please enter valid type like ${CONSTANT.HOME_PAGE_PRODUCTS.join(",")}`
  )
    .exists()
    .isIn(CONSTANT.HOME_PAGE_PRODUCTS),
];

const fetchCompareProduct = [
  query("from", "Please enter valid from").exists().isMongoId(),
  query("to", "Please enter valid to").exists().isMongoId(),
];

const downloadProductFileSample = [
  param("type", "Please enter valid type like CSV, XLS")
    .exists()
    .isIn(["CSV", "XLS"]),
];

export default {
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
