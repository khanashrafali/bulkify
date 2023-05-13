import _ from "lodash";
import mongoose from "mongoose";
import { Parser } from "json2csv";
import validator from "validator";
import { adsService, collectionService, reviewService } from ".";
import {
  bdProductModel,
  cartModel,
  categoryModel,
  collectionModel,
  orderModel,
  productModel,
  userModel,
  vendorModel,
  wishlistModel,
} from "../models";
import { CONSTANT, fileHandler, helper } from "../utils";
import { ApprovalStatus, HomeProduct, IRequest, OrderStatus, PageInfo, UserRole } from "../utils/interfaces";

helper.loadEnvFile();

/**
 * find Product
 */
const findProduct = async (productIdOrSlug: string) => {
  try {
    let conditions: any = checkProductIdOrSlug({}, productIdOrSlug);
    let product = await _populateProduct(productModel.findOne(conditions), {}, true);
    if (!product) throw helper.buildError("No product found with this id/slug", 404);
    return product;
  } catch (error) {
    throw error;
  }
};

const checkProductIdOrSlug = (conditions: any, productIdOrSlug: string) => {
  if (validator.isMongoId(productIdOrSlug?.toString())) conditions._id = productIdOrSlug;
  else conditions.slug = productIdOrSlug;
  return conditions;
};

/**
 * find Best Selling Products
 */
const getBestSellingProducts = async (pageInfo: PageInfo | null, conditions: any) => {
  try {
    let docs = pageInfo
      ? [{ $sort: { sumOfQuantity: -1 } }, { $skip: pageInfo.skip }, { $limit: pageInfo.pageSize }]
      : [];

    let stages: any[] = [
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
    let orderedProducts: any[] = await orderModel.aggregate(stages);
    let data = orderedProducts[0] ? orderedProducts[0] : [];

    return helper.makePaginatedData(data?.docs ?? [], data?.count || 0, pageInfo);
  } catch (error) {
    throw error;
  }
};

/**
 * get product list by collection slug/id handler
 */
const _getProductByCollection = async (collection: any, queryParams: any) => {
  try {
    let conditions: any = { status: true };
    let colToJson: any = collection.toJSON();
    let collConditions: any[] = [];

    if (queryParams?._id) conditions._id = queryParams?._id;

    for (let cond of colToJson.conditions || []) {
      let query = helper.getProductQuery(cond.field, cond.condition, cond.value);
      if (query) collConditions.push(query);
    }

    if (collConditions?.length) {
      if (colToJson.mustMatchAll) conditions["$and"] = collConditions;
      else conditions["$or"] = collConditions;
    }

    if (queryParams.textSearch?.length)
      conditions.metaDescription = {
        $regex: helper.regxEscape(queryParams.textSearch),
        $options: "i",
      };
    return await _populateProduct(productModel.findOne(conditions), queryParams);
  } catch (error) {
    throw error;
  }
};

/**
 * build conditions
 */
const _setConditions = (queryParams: any, conditions: any, userObj: any, role: UserRole) => {
  if (queryParams.textSearch && validator.trim(queryParams.textSearch)?.length)
    conditions["$text"] = { $search: queryParams.textSearch };

  if (userObj && role == UserRole.VENDOR) {
    conditions["$and"] = conditions["$and"] ?? [];
    conditions["$and"].push({ vendor: userObj._id });
  }

  if ("status" in queryParams) conditions.status = queryParams.status;
  if ("createdAt" in queryParams) conditions.date = queryParams.createdAt;
  if ("isApproved" in queryParams) conditions.isApproved = queryParams.isApproved;
  if ("type" in queryParams) conditions.type = queryParams.type;
  if ("vendor" in queryParams) conditions.vendor = queryParams.vendor;
  return conditions;
};

const _populateProductByAdmin = (query: any, queryParams: any, isSingle: boolean = false) => {
  const sortBy = queryParams?.sortBy?.length ? queryParams?.sortBy : "createdAt";
  const orderBy = queryParams?.orderBy ?? "DESC";
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

  if (!isSingle) query.sort({ [sortBy]: orderBy });
  return query;
};

/**
 * populate product data
 */
const _populateProduct = (query: any, queryParams: any, isSingle: boolean = false) => {
  const sortBy = queryParams?.sortBy?.length ? queryParams?.sortBy : "createdAt";
  const orderBy = queryParams?.orderBy ?? "DESC";
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

  if (!isSingle) query.sort({ [sortBy]: orderBy });
  return query;
};

/**
 * sort products variants by price in asc
 */
const _sortVariantsByProducts = (products: any[], role = UserRole.USER, collection?: any) => {
  return products.map((item) => {
    if (collection) item = { ...item._doc, collectionName: collection.title };
    item.variants = _.sortBy(item.variants, ["variant.price"]);
    if (role == UserRole.USER) item.variants = item.variants.filter((v: any) => !v?.deleted);
    item.isFav = false;
    item.isInCart = false;
    return item;
  });
};

/**
 * create product handler
 */
const addProduct = async (req: IRequest, body: any) => {
  try {
    let { variants } = body;

    variants = variants.map((v: any) => ({ ...v, totalQty: v.quantity }));

    let vendorObj: any = req.user.toJSON();

    // if (!vendorObj?.isProfileComplete) throw helper.buildError("Can't add product because your profile is incomplete", 400);
    // if (vendorObj.isApproved != ApprovalStatus.APPROVED) {
    //   throw helper.buildError("Can't add product because your profile status is " + vendorObj.isApproved, 400);
    // }
    // if (!vendorObj.isActive)
    //   throw helper.buildError("Can't add product because your profile is unactivated by admin", 400);
    // let location = await shiprocketService.getPickupAddress(vendorObj.pickupLocation);
    // if (!location?.phone_verified) throw helper.buildError("Your address verification in pending, please try again later", 400);

    return await productModel.create({
      ...body,
      vendor: vendorObj._id,
      variants: _.sortBy(variants, ["variant.mrp"]),
      isApproved: ApprovalStatus.APPROVED,
    });
  } catch (error) {
    throw error;
  }
};

/**
 * update product handler
 */
const updateProduct = async (req: IRequest, productIdOrSlug: string, body: any) => {
  try {
    let { vendor, name, description, images, variants, status, metaDescription } = body;
    let vendorObj: any = req.user.toJSON();

    if (vendor) vendorObj = await vendorModel.findOne({ _id: vendor }).lean();
    const product = await productModel.findOne(checkProductIdOrSlug({}, productIdOrSlug));

    if (!product) throw helper.buildError("No product found with this id", 404);
    const productObj: any = product.toJSON();

    if (productObj.vendor.toString() != vendorObj._id.toString()) {
      throw helper.buildError("You can't update this product", 400);
    }

    if (productObj.variants.length != variants.filter((v: any) => v._id).length) {
      throw helper.buildError("old variant mismatch with new data", 400);
    }

    variants = variants.map((v: any) => {
      if (!v._id) delete v._id;
      return { ...v, totalQty: v.quantity };
    });

    images = images?.length ? images : productObj.images;
    variants = _.sortBy(variants, ["variant.mrp"]);
    const isApproved = ApprovalStatus.APPROVED;
    return await product.set({ ...body, isApproved, variants, images, vendor: vendorObj._id }).save();
  } catch (error) {
    throw error;
  }
};

/**
 * create product handler
 */
const addProductByAdmin = async (req: IRequest, body: any) => {
  try {
    let { variants } = body;

    variants = variants.map((v: any) => ({ ...v, totalQty: v.quantity }));

    let saveProduct = await productModel.create({
      ...body,
      variants: _.sortBy(variants, ["variant.mrp"]),
      isApproved: ApprovalStatus.APPROVED,
    });

    return saveProduct._id;
  } catch (error) {
    throw error;
  }
};

/**
 * update product handler
 */
const updateProductByAdmin = async (req: IRequest, productIdOrSlug: string, body: any) => {
  try {
    let { name, description, images, variants, status, metaDescription } = body;
    const product = await productModel.findOne({ _id: productIdOrSlug });
    if (!product) throw helper.buildError("No product found with this id", 404);
    const productObj: any = product.toJSON();

    variants = variants.map((v: any) => {
      if (!v._id) delete v._id;
      return v;
    });

    const isApproved = ApprovalStatus.APPROVED;
    variants = _.sortBy(variants, ["variant.mrp"]);
    images = images?.length ? images : productObj.images;
    return await product.set({ ...body, isApproved, variants, images }).save();
  } catch (error) {
    throw error;
  }
};

/**
 * delete product handler
 */
const deleteProduct = async (req: IRequest, productIdOrSlug: string) => {
  try {
    let conditions: any = {};
    const product: any = await productModel.findOne(checkProductIdOrSlug(conditions, productIdOrSlug));
    if (!product) throw helper.buildError("No product found with this id/slug", 404);

    const productToJson: any = product.toJSON();
    const userObj: any = req.user.toJSON();

    // if (product.status) throw helper.buildError("Active product can't be deleted", 400);

    if (![UserRole.ADMIN, UserRole.SUPER_ADMIN].includes(userObj?.role)) {
      if (productToJson.vendor.toString() != userObj._id.toString())
        throw helper.buildError("You can't delete this product", 400);
    }

    await product.delete();
  } catch (error) {
    throw error;
  }
};

/**
 * delete product handler
 */
const deleteProductImage = async (productIdOrSlug: string, locations: string[]) => {
  try {
    const product = await productModel.findOne(checkProductIdOrSlug({}, productIdOrSlug));
    if (!product) throw helper.buildError("No product found with this id", 404);

    const productToJson: any = product.toJSON();
    await product.set({ images: productToJson.images.filter((url: any) => locations?.find((e) => url != e)) }).save();

    for await (let location of locations) await fileHandler.deleteFromS3(location);
  } catch (error) {
    throw error;
  }
};

/**
 * get single product handler
 */
const getProduct = async (productIdOrSlug: string, queryParams: any) => {
  try {
    let wishlistItems: any[] = [];
    let cartItems: any[] = [];
    let bdItems: any[] = [];

    if (queryParams?.userId) {
      let user = await userModel.findOne({ _id: queryParams?.userId });
      if (!user) throw helper.buildError("no user found with id", 404);
      wishlistItems = await wishlistModel.find({ user: user });
      cartItems = await cartModel.find({ user: user });
      bdItems = await bdProductModel.find({ user: user });
    }

    let conditions: any = checkProductIdOrSlug({}, productIdOrSlug);
    let product = await _populateProduct(productModel.findOne(conditions), {}, true);
    if (!product) throw helper.buildError("No product found with this id/slug", 404);

    let productObj: any = product.toJSON();
    productObj.isFav = false;

    productObj.variants = productObj.variants.map((v: any) => {
      v.isInCart = false;
      v.cartQuantity = 0;
      v.isBadalDaloAvailable = false;
      v.isBadalDaloInfo = null;
      return v;
    });

    if (wishlistItems?.length) {
      if (wishlistItems.find((w) => w.product.toString() == productObj._id.toString())) {
        productObj.isFav = true;
      }
    }

    if (cartItems?.length) {
      productObj.variants = productObj.variants.map((v: any) => {
        let cartItem = cartItems.find((ci) => {
          return ci.product.toString() == productObj._id.toString() && ci.variant._id.toString() == v._id.toString();
        });
        if (cartItem) v.isInCart = true;
        return v;
      });
    }

    if (bdItems?.length) {
      productObj.variants = productObj.variants.map((v: any) => {
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

    productObj.totalQty = (productObj.variants as any[]).reduce((p: any, cv) => p + cv.variant.quantity, 0);

    let reviews = await reviewService.getProductReviews(productObj._id);
    return { ...productObj, reviews };
  } catch (error) {
    throw error;
  }
};

/**
 * get single product by admin handler
 */
const getProductByAdmin = async (productIdOrSlug: string) => {
  try {
    let conditions: any = checkProductIdOrSlug({}, productIdOrSlug);
    let product = await _populateProductByAdmin(productModel.findOne(conditions), {}, true);
    if (!product) throw helper.buildError("No product found with this id/slug", 404);
    return product;
  } catch (error) {
    throw error;
  }
};

/**
 * get single product by vendor handler
 */
const getProductByVendor = async (productIdOrSlug: string) => {
  try {
    let conditions: any = checkProductIdOrSlug({}, productIdOrSlug);
    let product = await _populateProduct(productModel.findOne(conditions), {}, true);
    if (!product) throw helper.buildError("No product found with this id/slug", 404);
    return product;
  } catch (error) {
    throw error;
  }
};

/**
 * get product list by admin handler
 */
const getProductsByAdmin = async (req: IRequest, queryParams: any) => {
  try {
    let conditions: any = {};
    let vendorObj: any = req.user.toJSON();
    const pageInfo = helper.checkPagination(queryParams);
    conditions = _setConditions(queryParams, conditions, vendorObj, req.role);

    // set filter by
    if ("filterBy" in queryParams) {
      let filterBy = CONSTANT.FILTER_DROPDOWN.find((v: any) => v.key == queryParams.filterBy);
      if (filterBy) {
        queryParams.sortBy = filterBy?.sortBy;
        queryParams.orderBy = filterBy?.orderBy;
      }

      if (filterBy?.key && ["PRICE_LOW_TO_HIGH", "PRICE_HIGH_TO_LOW"].includes(filterBy.key)) {
        conditions.variants = { $ne: [] };
        conditions["variants.variant.mrp"] = { $ne: null };
      }

      if ("FEATURED" == queryParams.filterBy) conditions.isFeatured = true;
      if ("BEST_SELLING" == queryParams.filterBy) return await getBestSellingProducts(pageInfo, conditions);
    }

    console.log(conditions);

    const count = await productModel.countDocuments(conditions);
    const mongoQuery = productModel.find(conditions).collation({ locale: "en" });
    let docs: any[] = [];

    if (pageInfo) docs = await _populateProduct(mongoQuery.skip(pageInfo.skip).limit(pageInfo.pageSize), queryParams);
    else docs = await _populateProduct(mongoQuery, queryParams);

    return helper.makePaginatedData(_sortVariantsByProducts(docs), count, pageInfo);
  } catch (error) {
    throw error;
  }
};

/**
 * get product list by vendor handler
 */
const getProductsByVendor = async (req: IRequest, queryParams: any) => {
  try {
    let conditions: any = {};
    let userToJson: any = req.user.toJSON();
    const pageInfo = helper.checkPagination(queryParams);
    conditions = _setConditions(queryParams, conditions, userToJson, req.role);

    // set filter by
    if ("filterBy" in queryParams) {
      let filterBy = CONSTANT.FILTER_DROPDOWN.find((v: any) => v.key == queryParams.filterBy);
      if (filterBy) {
        queryParams.sortBy = filterBy?.sortBy;
        queryParams.orderBy = filterBy?.orderBy;
      }

      if (filterBy?.key && ["PRICE_LOW_TO_HIGH", "PRICE_HIGH_TO_LOW"].includes(filterBy.key)) {
        conditions.variants = { $ne: [] };
        conditions["variants.variant.mrp"] = { $ne: null };
      }

      if ("FEATURED" == queryParams.filterBy) conditions.isFeatured = true;
      if ("BEST_SELLING" == queryParams.filterBy) return await getBestSellingProducts(pageInfo, conditions);
    }

    const count = await productModel.countDocuments(conditions);
    const mongoQuery = productModel.find(conditions).collation({ locale: "en" });
    let docs: any[] = [];

    if (pageInfo) docs = await _populateProduct(mongoQuery.skip(pageInfo.skip).limit(pageInfo.pageSize), queryParams);
    else docs = await _populateProduct(mongoQuery, queryParams);

    return helper.makePaginatedData(_sortVariantsByProducts(docs), count, pageInfo);
  } catch (error) {
    throw error;
  }
};

/**
 * get product list handler
 */
const getProducts = async (queryParams: any) => {
  try {
    let user: any;
    let wishlistItems: any[] = [];
    let cartItems: any[] = [];
    let bdItems: any[] = [];

    if (queryParams?.userId) {
      user = await userModel.findOne({ _id: queryParams?.userId });
      if (!user) throw helper.buildError("no user found with id", 404);
      wishlistItems = await wishlistModel.find({ user: user });
      cartItems = await cartModel.find({ user: user });
      bdItems = await bdProductModel.find({ user: queryParams?.userId });
    }

    let conditions: any = { status: true, isApproved: ApprovalStatus.APPROVED };
    const pageInfo = helper.checkPagination(queryParams);
    conditions = _setConditions(queryParams, conditions, null, UserRole.USER);

    if ("product" in queryParams) {
      conditions._id = { $ne: queryParams.product };
    }

    if ("category" in queryParams) {
      let cat: any = await categoryModel
        .findOne({ _id: queryParams.category, level: 0 })
        .populate({
          path: "subCategories",
          populate: { path: "subCategories" },
        })
        .lean();

      if (cat) {
        if (!cat.status || cat.deleted) conditions.category = { $ne: queryParams.category };
        else conditions.category = queryParams.category;
      }
      if ("subCategory" in queryParams) {
        let cat2 = cat.subCategories.find((v: any) => v._id.toString() == queryParams.subCategory);
        if (cat2) {
          if (!cat2.status || cat2.deleted) {
            conditions.subCategory = { $ne: queryParams.subCategory };
          } else conditions.subCategory = queryParams.subCategory;
        }
        if ("childCategory" in queryParams) {
          let cat3 = cat2.subCategories.find((v: any) => v._id.toString() == queryParams.childCategory);
          if (cat3) {
            if (!cat3.status || cat3.deleted) {
              conditions.subCategories = { $nin: [queryParams.childCategory] };
            } else {
              conditions.subCategories = { $in: [queryParams.childCategory] };
            }
          }
        }
      }
    }

    if ("mainCategory" in queryParams) conditions.mainCategories = queryParams.mainCategory;

    // set filter by
    if ("filterBy" in queryParams) {
      let filterBy = CONSTANT.FILTER_DROPDOWN.find((v: any) => v.key == queryParams.filterBy);
      if (filterBy) {
        queryParams.sortBy = filterBy?.sortBy;
        queryParams.orderBy = filterBy?.orderBy;
      }

      if (filterBy?.key && ["PRICE_LOW_TO_HIGH", "PRICE_HIGH_TO_LOW"].includes(filterBy.key)) {
        conditions.variants = { $ne: [] };
        conditions["variants.variant.mrp"] = { $ne: null };
      }

      if ("FEATURED" == queryParams.filterBy) conditions.isFeatured = true;
      if ("BEST_SELLING" == queryParams.filterBy) {
        return await getBestSellingProducts(pageInfo, conditions);
      }
    }

    const count = await productModel.countDocuments(conditions);
    const mongoQuery = productModel.find(conditions).collation({ locale: "en" });
    let docs: any[] = [];

    if (pageInfo) {
      docs = await _populateProduct(mongoQuery.skip(pageInfo.skip).limit(pageInfo.pageSize).lean(), queryParams);
    } else docs = await _populateProduct(mongoQuery.lean(), queryParams);

    docs = _sortVariantsByProducts(docs, UserRole.USER);

    docs = docs.map((p: any) => {
      p.isBadalDaloAvailable = false;
      p.isBadalDaloInfo = null;
      p.isFav = false;
      p.isInCart = false;
      p.totalQty = (p.variants as any[]).reduce((p: any, cv) => p + cv.variant.quantity, 0);
      return p;
    });

    if (wishlistItems?.length) {
      docs = docs.map((p) => {
        if (wishlistItems.find((w) => w.product.toString() == p._id.toString())) p.isFav = true;
        return p;
      });
    }

    if (bdItems?.length) {
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

    if (cartItems?.length) {
      docs = docs.map((p) => {
        if (
          cartItems.find(
            (w) => w.product.toString() == p._id.toString() && w.variant._id.toString() == p.variants[0]._id.toString()
          )
        ) {
          p.isInCart = true;
        }
        return p;
      });
    }

    return helper.makePaginatedData(docs, count, pageInfo);
  } catch (error) {
    throw error;
  }
};

const searchProducts = async (queryParams: any) => {
  try {
    let user: any;
    let wishlistItems: any[] = [];
    let cartItems: any[] = [];
    let filterData = queryParams?.filterData;

    let adsItems = (await adsService.getAdss({ location: "FILTER" }))?.docs || [];

    if (queryParams?.userId) {
      // user = await userModel.findOne({ _id: queryParams?.userId });
      // if (!user) throw helper.buildError("no user found with id", 404);
      wishlistItems = await wishlistModel.find({ user: queryParams?.userId });
      cartItems = await cartModel.find({ user: queryParams?.userId });
    }

    let conditions: any = { status: true, isApproved: ApprovalStatus.APPROVED };
    const pageInfo = helper.checkPagination(queryParams);
    conditions = _setConditions(queryParams, conditions, null, UserRole.USER);

    if (filterData) {
      if(filterData?.categories?.length) {
        conditions.category = { $in: filterData?.categories };
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
        if (filterData?.subCategories?.length) {
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

      if (filterData?.price?.from || filterData?.price?.to) {
      conditions["$and"] = [
        { "variants.variant.sellingPrice": { $gte: filterData.price.from } },
        { "variants.variant.sellingPrice": { $lte: filterData.price.to } },
      ];
      }

      if (filterData?.rating?.length) {
        conditions["$and"] = filterData?.rating?.map((r: any) => {
          return { rating: { $gte: r } };
          // if (adminRating)
          // return { rating: { $gte: r } };
        });
        // conditions["$or"] = filterData?.rating?.map((r: any) => ({ adminRating: { $gte: r } }));
      }
      if (filterData?.brands?.length) {
        conditions.brand = { $in: filterData?.brands?.map((b: any) => mongoose.Types.ObjectId(b)) };
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
      let filterBy = CONSTANT.FILTER_DROPDOWN.find((v: any) => v.key == queryParams.filterBy);
      if (filterBy) {
        queryParams.sortBy = filterBy?.sortBy;
        queryParams.orderBy = filterBy?.orderBy;
      }

      if (filterBy?.key && ["PRICE_LOW_TO_HIGH", "PRICE_HIGH_TO_LOW"].includes(filterBy.key)) {
        conditions.variants = { $ne: [] };
        conditions["variants.variant.mrp"] = { $ne: null };
      }

      if ("FEATURED" == queryParams.filterBy) conditions.isFeatured = true;
      if ("BEST_SELLING" == queryParams.filterBy) return await getBestSellingProducts(pageInfo, conditions);
    }

    let newCondition: any = { ...conditions };

    delete newCondition["$text"];

    let minMaxPrice = (
      await productModel.aggregate([
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
      ])
    )[0];
    const count = await productModel.countDocuments(conditions);
    const mongoQuery = productModel.find(conditions).collation({ locale: "en" });
    let docs: any[] = [];

    if (pageInfo) {
      docs = await _populateProduct(mongoQuery.skip(pageInfo.skip).limit(pageInfo.pageSize).lean(), queryParams);
    } else docs = await _populateProduct(mongoQuery.lean(), queryParams);


    docs = _sortVariantsByProducts(docs, UserRole.USER);

    docs = docs.map((p: any) => {
      p.isBadalDaloAvailable = false;
      p.isBadalDaloInfo = null;
      p.isFav = false;
      p.isInCart = false;
      p.totalQty = (p.variants as any[]).reduce((p: any, cv) => p + cv.variant.quantity, 0);
      return p;
    });

    if (wishlistItems?.length) {
      docs = docs.map((p) => {
        if (wishlistItems.find((w) => w.product.toString() == p._id.toString())) p.isFav = true;
        return p;
      });
    }

    if (cartItems?.length) {
      docs = docs.map((p) => {
        if (cartItems.find((w) => w.product.toString() == p._id.toString())) p.isInCart = true;
        return p;
      });
    }

    docs = docs.map((p, i) => {
      p.ads = adsItems[i] ?? null;
      return p;
    });

    return helper.makePaginatedData(docs, count, {
      ...pageInfo,
      min: minMaxPrice?.min || 0,
      max: minMaxPrice?.max || 1000,
    });
  } catch (error) {
    throw error;
  }
};

/**
 * get product list by collection slug/id handler
 */
const getProductsByCollection = async (collectionIdOrSlug: string, queryParams: any) => {
  try {
    let collection = await collectionService.fetchCollection(collectionIdOrSlug);
    let conditions: any = { status: true, isApproved: ApprovalStatus.APPROVED };
    let collectionObj: any = collection.toJSON();
    let collConditions: any[] = [];
    const pageInfo = helper.checkPagination(queryParams);

    if (queryParams?._id) conditions._id = queryParams?._id;

    for (let cond of collectionObj.conditions || []) {
      let query = helper.getProductQuery(cond.field, cond.condition, cond.value);
      if (query) collConditions.push(query);
    }

    if (collectionObj.mustMatchAll) conditions["$and"] = collConditions;
    else conditions["$or"] = collConditions;

    if (queryParams.textSearch?.length) conditions["$text"] = { $search: queryParams.textSearch };

    // set filter by
    if ("filterBy" in queryParams) {
      let filterBy = CONSTANT.FILTER_DROPDOWN.find((v: any) => v.key == queryParams.filterBy);
      if (filterBy) {
        queryParams.sortBy = filterBy?.sortBy;
        queryParams.orderBy = filterBy?.orderBy;
      }

      if (filterBy?.key && ["PRICE_LOW_TO_HIGH", "PRICE_HIGH_TO_LOW"].includes(filterBy.key)) {
        conditions.variants = { $ne: [] };
        conditions["variants.variant.mrp"] = { $ne: null };
      }

      if ("FEATURED" == queryParams.filterBy) conditions.isFeatured = true;
      if ("BEST_SELLING" == queryParams.filterBy) return await getBestSellingProducts(pageInfo, conditions);
    }

    const count = await productModel.countDocuments(conditions);
    const mongoQuery = productModel.find(conditions).collation({ locale: "en" });
    let docs: any[] = [];

    if (pageInfo) docs = await _populateProduct(mongoQuery.skip(pageInfo.skip).limit(pageInfo.pageSize), queryParams);
    else docs = await _populateProduct(mongoQuery, queryParams);

    return helper.makePaginatedData(_sortVariantsByProducts(docs, UserRole.USER, collectionObj), count, pageInfo);
  } catch (error) {
    throw error;
  }
};

/**
 * update product status handler
 */
const updateProductStatus = async (req: IRequest, productIdOrSlug: string, status: boolean) => {
  try {
    let product: any = await productModel.findOne(checkProductIdOrSlug({}, productIdOrSlug));
    if (!product) throw helper.buildError("No product found with this id", 404);

    const productObj: any = product.toJSON();
    const userObj: any = req.user.toJSON();
    if (![UserRole.ADMIN, UserRole.SUPER_ADMIN].includes(userObj?.role)) {
      if (productObj.vendor.toString() != userObj._id.toString())
        throw helper.buildError("You can't change status of this product", 400);
      await product.set({ status }).save();
    } else {
      await product.set({ status }).save();
    }
  } catch (error) {
    throw error;
  }
};

/**
 * approve vendor's product by admin handler
 */
const updateVendorProductApprovalStatus = async (req: IRequest, productIdOrSlug: string, status: boolean) => {
  try {
    let product: any = await productModel.findOne(checkProductIdOrSlug({}, productIdOrSlug));
    if (!product) throw helper.buildError("No product found with this id", 404);
    await product.set({ isApproved: status }).save();
  } catch (error) {
    throw error;
  }
};

/**
 * update product featured status by admin handler
 */
const updateProductFeatureStatus = async (req: IRequest, productIdOrSlug: string, status: boolean) => {
  try {
    let product: any = await productModel.findOne(checkProductIdOrSlug({}, productIdOrSlug));
    if (!product) throw helper.buildError("No product found with this id", 404);
    await product.set({ isFeatured: status }).save();
  } catch (error) {
    throw error;
  }
};

/**
 * get collections by products
 */
const getCollectionsByProductId = async (productIdOrSlug: any) => {
  try {
    let collections = await collectionModel.find({ status: true });
    let selectedCollections: any[] = [];

    for await (let col of collections) {
      let item = await _getProductByCollection(col, { _id: productIdOrSlug.toString() });
      if (item) selectedCollections.push(col);
    }

    return selectedCollections;
  } catch (error) {
    throw error;
  }
};

/**
 * add bluk products through xls file
 */
const uploadBulkProducts = async (req: IRequest, products: any[]) => {
  try {
    products = products.map((p) => {
      p.variants = _.sortBy(p.variants, ["variant.price"]);
      return p;
    });

    // not using insert many because mongoose slug updater not supported
    let uploaded = [];
    for await (let p of products) uploaded.push(await productModel.create(p));
    return uploaded;
  } catch (error) {
    throw error;
  }
};

/**
 * find High Rated Products
 */
const fetchHighRatedProducts = async (queryParams: any) => {
  try {
    let condition = { status: true, rating: { $gt: 0 } };
    let query = productModel.find(condition).sort({ rating: -1 });
    let count = await productModel.countDocuments(condition);
    let pageInfo = helper.checkPagination(queryParams);
    let docs: any[] = [];

    if (pageInfo) docs = await query.skip(pageInfo.skip).limit(pageInfo.pageSize);
    else docs = await query;

    return helper.makePaginatedData(_sortVariantsByProducts(docs, UserRole.USER), count, pageInfo);
  } catch (error) {
    throw error;
  }
};

/**
 * find High views Products
 */
const fetchHighViewsProducts = async (queryParams: any) => {
  try {
    let condition = { status: true, viewCount: { $gt: 0 } };
    let query = productModel.find(condition).sort({ viewCount: -1 });
    let count = await productModel.countDocuments(condition);
    let pageInfo = helper.checkPagination(queryParams);
    let docs: any[] = [];

    if (pageInfo) docs = await query.skip(pageInfo.skip).limit(pageInfo.pageSize);
    else docs = await query;

    return helper.makePaginatedData(_sortVariantsByProducts(docs, UserRole.USER), count, pageInfo);
  } catch (error) {
    throw error;
  }
};

/**
 * find Home Page Products
 */
const fetchHomePageProducts = async (pType: string, queryParams: any) => {
  try {
    if (pType == HomeProduct.HIGH_RATED) return await fetchHighRatedProducts(queryParams);
    if (pType == HomeProduct.HIGH_VIEWS) return await fetchHighViewsProducts(queryParams);
  } catch (error) {
    throw error;
  }
};

/**
 * fetch products for compare
 */
const fetchCompareProduct = async (fromProduct: any, toProduct: any) => {
  try {
    let datafromProduct = await getProduct(fromProduct, {});
    let datatoProduct = await getProduct(toProduct, {});
    return [datafromProduct, datatoProduct];
  } catch (error) {
    throw error;
  }
};

/**
 * fetch top selling product
 */
const fetchTopSellingProduct = async () => {
  try {
    let orders = await orderModel.aggregate([
      // { $match: { currentOrderStatus: OrderStatus.DELIVERED } },
      { $limit: 5 },
    ]);

    let pIds: any[] = [];

    for (let order of orders) {
      for (let p of order.items) {
        if (!pIds.includes(p.product.toString())) pIds.push(p.product.toString());
      }
    }

    let conditions: any = {};
    if (pIds.length) conditions._id = { $in: pIds };

    return await productModel.find(conditions).sort({ updatedAt: -1 }).limit(5);
  } catch (error) {
    throw error;
  }
};

const updateProductRating = async (productId: string, adminRating: number) => {
  try {
    let product = await productModel.findOne({ _id: productId });
    if (!product) throw helper.buildError("no product found with this id", 404);
    await product.set({ adminRating }).save();
  } catch (error) {
    throw error;
  }
};

const downloadProductFileSample = async (type: string, cb: any) => {
  let path;
  if (type == "CSV") path = helper.buildPath("public", "examples", "products.csv");
  else path = helper.buildPath("public", "examples", "products.xls");
  cb(path);
};

const downloadAllProducts = async () => {
  let products: any[] = await productModel.find({}).lean();

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
  const csvParser = new Parser({ fields: csvFields });
  let jsonProducts: any[] = [];

  for (let p of products) {
    let obj: any = {
      "Product Name": p.name,
      "Product Description": p.description,
      Images: (p?.images || []).join(","),
      "Meta Description": p.metaDescription,
      Tags: (p?.tags || []).join(","),
      "Variant Selling Price": 0,
      "Variant MRP": 0,
      "Badal Dalo Price": 0,
      "Variant Quantity": 0,
      "Variant SKU": "",
    };
    for (let vr of p.variants) {
      let v = vr.variant;
      obj["Variant Selling Price"] = v?.sellingPrice || 0;
      obj["Variant MRP"] = v?.mrp || 0;
      obj["Badal Dalo Price"] = v?.badalDaloPrice || 0;
      obj["Variant Quantity"] = v?.quantity || 0;
      obj["Variant SKU"] = v?.SKU;

      for (let vInfo in v) {
        if (!["quantity", "sellingPrice", "mrp", "badalDaloPrice", "SKU", "deleted"].includes(vInfo)) {
          obj[vInfo] = v[vInfo];
        }
      }

      jsonProducts.push({ ...obj });
    }
  }

  let csvData = csvParser.parse(jsonProducts);

  return csvData;
};

export default {
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
