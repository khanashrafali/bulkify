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
const models_1 = require("../../models");
const utils_1 = require("../../utils");
const interfaces_1 = require("../../utils/interfaces");
const allowedRoles = utils_1.CONSTANT.USER_ROLES.filter((v) => v != interfaces_1.UserRole.ADMIN);
const checkDuplicatePincode = (val, { req }) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    let conditions = { pincode: val };
    if ((_a = req.params) === null || _a === void 0 ? void 0 : _a.id)
        conditions._id = { $ne: (_b = req.params) === null || _b === void 0 ? void 0 : _b.id };
    const pincode = yield models_1.deleveryAddressModel.findOne(conditions);
    if (pincode)
        throw utils_1.helper.buildError("Same pincode name already exists", 400);
});
const addDeleveryAddress = [
    (0, express_validator_1.body)("pincode", "Please enter valid pincode").exists().trim().notEmpty().custom(checkDuplicatePincode),
];
const getDeleveryAddress = [(0, express_validator_1.param)("id", "Please enter valid address id").exists().isMongoId()];
const updateDeleveryAddress = [...getDeleveryAddress, ...addDeleveryAddress];
const deleteDeleveryAddress = [...getDeleveryAddress];
const getDeleveryAddresses = [];
const parseDataFromCsv = (ireq, filePath) => __awaiter(void 0, void 0, void 0, function* () {
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
    return csvToJson;
});
const validateParseCSV = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d, _e, _f;
    try {
        utils_1.helper.checkPayloadFiles(req);
        const ireq = req;
        const filePath = (_c = req === null || req === void 0 ? void 0 : req.file) === null || _c === void 0 ? void 0 : _c.path;
        const fileName = (_d = req.file) === null || _d === void 0 ? void 0 : _d.originalname;
        if (!filePath)
            return;
        if (((_e = req === null || req === void 0 ? void 0 : req.file) === null || _e === void 0 ? void 0 : _e.mimetype) == "text/csv" || (fileName === null || fileName === void 0 ? void 0 : fileName.includes(".csv"))) {
            req.body.locations = yield parseDataFromCsv(ireq, filePath);
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
exports.default = {
    addDeleveryAddress,
    updateDeleveryAddress,
    getDeleveryAddress,
    deleteDeleveryAddress,
    getDeleveryAddresses,
    validateParseCSV,
};
