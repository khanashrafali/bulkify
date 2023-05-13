import csv from "csv-parser";
import { NextFunction, Request, Response } from "express";
import { body, CustomValidator, param } from "express-validator";
import fs from "fs";
import { deleveryAddressModel } from "../../models";
import { CONSTANT, fileHandler, helper } from "../../utils";
import { IRequest, UserRole } from "../../utils/interfaces";

const allowedRoles = CONSTANT.USER_ROLES.filter((v) => v != UserRole.ADMIN);

const checkDuplicatePincode: CustomValidator = async (val, { req }) => {
  let conditions: any = { pincode: val };
  if (req.params?.id) conditions._id = { $ne: req.params?.id };
  const pincode = await deleveryAddressModel.findOne(conditions);
  if (pincode) throw helper.buildError("Same pincode name already exists", 400);
};

const addDeleveryAddress: any[] = [
  body("pincode", "Please enter valid pincode").exists().trim().notEmpty().custom(checkDuplicatePincode),
];
const getDeleveryAddress: any[] = [param("id", "Please enter valid address id").exists().isMongoId()];
const updateDeleveryAddress: any[] = [...getDeleveryAddress, ...addDeleveryAddress];
const deleteDeleveryAddress: any[] = [...getDeleveryAddress];
const getDeleveryAddresses: any[] = [];

const parseDataFromCsv = async (ireq: IRequest, filePath: string) => {
  let csvToJson: any[] = [];

  await new Promise((res, rej) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data: any) => csvToJson.push(data))
      .on("end", () => {
        res(csvToJson);
      });
  });

  await fileHandler.deleteFile(filePath);
  return csvToJson;
};

const validateParseCSV = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.checkPayloadFiles(req);

    const ireq = req as IRequest;
    const filePath = req?.file?.path;
    const fileName = req.file?.originalname;
    if (!filePath) return;

    if (req?.file?.mimetype == "text/csv" || fileName?.includes(".csv")) {
      req.body.locations = await parseDataFromCsv(ireq, filePath);
    } else throw helper.buildError("please enter valid file like xls,csv", 400);

    next();
  } catch (error) {
    if (req?.file) await fileHandler.deleteFile(req?.file?.path);
    next(error);
  }
};

export default {
  addDeleveryAddress,
  updateDeleveryAddress,
  getDeleveryAddress,
  deleteDeleveryAddress,
  getDeleveryAddresses,
  validateParseCSV,
};
