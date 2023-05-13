import { body, CustomValidator, param } from "express-validator";
import { brandModel } from "../../models";
import { helper } from "../../utils";

const checkDuplicateBrand: CustomValidator = async (val, { req }) => {
  try {
    let conditions: any = { brandName: { $regex: helper.regxEscape(val), $options: "i" } };
    if (req.params?.brandId) conditions._id = { $ne: req.params?.brandId };
    const address = await brandModel.findOne(conditions);
    console.log({ address });
    if (address) throw helper.buildError("same brand already exists", 400);
  } catch (error) {
    throw error;
  }
};

const addBrand = [
  body("image", "Please enter valid image url").optional().isObject(),
  body("brandName", "Please enter valid brandName").exists().trim().notEmpty().custom(checkDuplicateBrand),
  body("categories", "Please enter valid categories").exists().isArray(),
  body("categories.*", "Please enter valid category").exists().isMongoId(),
  body("isApproved", "Please enter valid isApproved").exists().trim().isBoolean(),
];

const getBrand = [param("brandId", "Please enter valid brandId").exists().isMongoId()];
const updateBrand = [...getBrand, ...addBrand];
const deleteBrand = [...getBrand];
const updateStatus = [...getBrand, body("isApproved", "Please enter valid isApproved").exists().trim().isBoolean()];

export default {
  addBrand,
  updateBrand,
  updateStatus,
  getBrand,
  deleteBrand,
};
