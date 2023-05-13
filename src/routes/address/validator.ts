import { body, CustomValidator, param } from "express-validator";
import { addressModel } from "../../models";
import { CONSTANT, helper } from "../../utils";
import { IRequest } from "../../utils/interfaces";

const checkDuplicateAddressTag: CustomValidator = async (val, { req }) => {
  try {
    let iReq = req as IRequest;
    let conditions: any = { user: iReq.user._id, tag: val };
    if (req.params?.addressId) conditions._id = { $ne: req.params?.addressId };
    const address = await addressModel.findOne(conditions);
    if (address) throw helper.buildError("same address tag already exists", 400);
  } catch (error) {
    throw error;
  }
};

const postSaveAddress = [
  // body("tag", "Please enter valid tag").exists().trim().notEmpty().custom(checkDuplicateAddressTag),
  // body("email", "Please enter valid email").exists().trim().notEmpty().isEmail().normalizeEmail(),
  body("firstName", "Please enter valid firstName")
    .exists()
    .trim()
    .notEmpty()
    .isLength({ max: 100 })
    .withMessage("Length must be less then 100")
    .isAlpha("en-IN", { ignore: [".", " ", "_"] }),
  body("lastName", "Please enter valid lastName")
    .exists()
    .trim()
    .notEmpty()
    .isLength({ max: 100 })
    .withMessage("Length must be less then 100")
    .isAlpha("en-IN", { ignore: [".", " ", "_"] }),
  body("mobileNumber", "Please enter valid mobileNumber").exists().trim().notEmpty().isMobilePhone("en-IN"),
  body("city", "Please enter valid city")
    .exists()
    .trim()
    .notEmpty()
    .isAlpha("en-IN", { ignore: [".", " ", ",", "&"] }),
  body("state", "Please enter valid state"),
  body("pinCode", "Please enter valid pin code").exists().trim().notEmpty().matches(CONSTANT.REGX.Pincode),
  body("address", "Please enter valid address").exists().trim().notEmpty(),
  body("isDefault", "Please enter valid isDefault").exists().isBoolean(),
];

const getAddress = [param("addressId", "Please enter valid addressId").exists().isMongoId()];

const putUpdateAddress = [...getAddress, ...postSaveAddress];

const deleteAddress = [...getAddress];

export default {
  postSaveAddress,
  getAddress,
  putUpdateAddress,
  deleteAddress,
};
