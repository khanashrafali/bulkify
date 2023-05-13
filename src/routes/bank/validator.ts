import { body, CustomValidator, param } from "express-validator";
import { bankModel } from "../../models";
import { CONSTANT, helper } from "../../utils";
import { IRequest } from "../../utils/interfaces";

const checkDuplicateAddressTag: CustomValidator = async (val, { req }) => {
  try {
    let iReq = req as IRequest;
    let conditions: any = { user: iReq.user._id, tag: val };
    if (req.params?.bankId) conditions._id = { $ne: req.params?.bankId };
    const address = await bankModel.findOne(conditions);
    if (address) throw helper.buildError("same address tag already exists", 400);
  } catch (error) {
    throw error;
  }
};

const saveBank = [
  body("accountNumber", "Please enter valid accountNumber").exists().trim().notEmpty(),
  body("holderName", "Please enter valid holderName").exists().trim().notEmpty(),
  body("ifscCode", "Please enter valid ifscCode").exists().trim().notEmpty().matches(CONSTANT.REGX.IFSC),
  body("isDefault", "Please enter valid isDefault").exists().isBoolean(),
];

const getBank = [param("bankId", "Please enter valid bankId").exists().isMongoId()];
const updateBank = [...getBank, ...saveBank];
const deleteBank = [...getBank];
const putSetDefaultBank = [...getBank];

export default {
  saveBank,
  getBank,
  updateBank,
  deleteBank,
  putSetDefaultBank,
};
