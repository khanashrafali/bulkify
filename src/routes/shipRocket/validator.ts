import { body } from "express-validator";
import { CONSTANT } from "../../utils";

const postSaveAddress = [
  body("pickup_location", "Please enter valid pickup_location").exists().trim().notEmpty(),
  body("email", "Please enter valid email").exists().trim().notEmpty().isEmail().normalizeEmail(),
  body("name", "Please enter valid name")
    .exists()
    .trim()
    .notEmpty()
    .isLength({ max: 100 })
    .withMessage("Length must be less then 100")
    .isAlpha("en-IN", { ignore: [".", " ", "_"] }),
  body("phone", "Please enter valid mobileNumber").exists().trim().notEmpty().isMobilePhone("en-IN"),
  body("address", "Please enter valid address")
    .optional({ checkFalsy: true })
    .exists()
    .trim()
    .notEmpty()
    .isLength({ min: 10 })
    .withMessage("Address Line 1 can't be less than 10 characters."),
  body("address_2", "Please enter valid address_2").optional({ checkFalsy: true }).exists().trim(),
  body("city", "Please enter valid city")
    .exists()
    .trim()
    .notEmpty()
    .isAlpha("en-IN", { ignore: [".", " ", ",", "&"] }),
  body("pin_code", "Please enter valid pin code").exists().trim().notEmpty().matches(CONSTANT.REGX.Pincode),
  body("state", "Please enter valid state")
    .exists()
    .trim()
    .notEmpty()
    .isAlpha("en-IN", { ignore: [".", " ", ",", "&"] }),
];

export default {
  postSaveAddress,
};
