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
const path_1 = __importDefault(require("path"));
const numId = require("nodejs-unique-numeric-id-generator");
const moment_1 = __importDefault(require("moment"));
const lodash_1 = __importDefault(require("lodash"));
const crypto_1 = require("crypto");
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_validator_1 = require("express-validator");
const interfaces_1 = require("./interfaces");
const _1 = require(".");
// build path
const buildPath = (...pathSeg) => path_1.default.join(process.cwd(), ...pathSeg);
// build unique hash
const getHash = () => {
    var current_date = new Date().valueOf().toString();
    var random = Math.random().toString();
    return (0, crypto_1.createHash)("sha1")
        .update(current_date + random)
        .digest("hex");
};
// load environment file
const loadEnvFile = () => dotenv_1.default.config({ path: buildPath(".env") });
loadEnvFile();
// build error object
const buildError = (message = "An Error Occured!", statusCode = 500, data = null, status = false) => {
    let err = new Error(message);
    err.statusCode = statusCode;
    err.status = status;
    err.data = data;
    return err;
};
// build response object
const buildResponse = (res, message, data = null, statusCode = 200, status = true) => {
    return res.status(statusCode).json({ message, data, statusCode, status });
};
// validate request payload is valid
const handlePayloadError = (req) => {
    const err = (0, express_validator_1.validationResult)(req);
    if (!err.isEmpty())
        throw buildError(err.array()[0].msg, 400, err.array());
};
// validate request contains files
const checkPayloadFiles = (req, msg = "files is required") => {
    var _a, _b;
    if (!req.file && !((_a = Object.keys((req === null || req === void 0 ? void 0 : req.files) || {})) === null || _a === void 0 ? void 0 : _a.length) && !((_b = req === null || req === void 0 ? void 0 : req.files) === null || _b === void 0 ? void 0 : _b.length))
        throw buildError(msg, 400);
};
// validate request contains files
const checkUserRole = (req, allowedRoles = [interfaces_1.UserRole.SUPER_ADMIN, interfaces_1.UserRole.ADMIN], msg = "unauthorize") => {
    const userToJson = req.user.toJSON();
    if (!allowedRoles.includes(userToJson.role))
        throw buildError(msg, 400);
    if (userToJson.role == interfaces_1.UserRole.ADMIN && !userToJson.isActive)
        throw _1.helper.buildError("Your account is deactived by super admin", 400);
};
const sendOTP = (mobileNumber, msg) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Load the AWS SDK for Node.js
        aws_sdk_1.default.config.update({ region: process.env.AWS_REGION });
        var params = { Message: msg, PhoneNumber: `+91${mobileNumber}` };
        var publishTextPromise = new aws_sdk_1.default.SNS({ apiVersion: "2010-03-31" }).publish(params).promise();
        return publishTextPromise
            .then((data) => console.log("MessageID is " + data.MessageId))
            .catch((err) => console.error(err, err.stack));
    }
    catch (error) {
        console.log("send otp error", error);
        throw error;
    }
});
const regxEscape = (val) => `^${val.replace(/[-[\]{}()*+?.,\\/^$|#\s]/g, "\\$&")}$`;
// check pagination params
const checkPagination = (pageParams) => {
    let page = +(pageParams === null || pageParams === void 0 ? void 0 : pageParams.page);
    let pageSize = +(pageParams === null || pageParams === void 0 ? void 0 : pageParams.pageSize);
    if (!page || !pageSize)
        return null;
    return { page, pageSize, skip: (page - 1) * pageSize };
};
// build pagination with list
const getPaginatedData = (itemsList, pageInfo) => {
    return {
        page: pageInfo === null || pageInfo === void 0 ? void 0 : pageInfo.page,
        pageSize: pageInfo === null || pageInfo === void 0 ? void 0 : pageInfo.pageSize,
        docs: lodash_1.default.drop(itemsList, pageInfo.skip).slice(0, pageInfo.pageSize),
        count: itemsList.length,
        pages: Math.ceil(itemsList.length / pageInfo.pageSize),
    };
};
// build paginated response data
const makePaginatedData = (pagedItems, count, pageInfo) => {
    let pageData = { page: pageInfo === null || pageInfo === void 0 ? void 0 : pageInfo.page, pageSize: pageInfo === null || pageInfo === void 0 ? void 0 : pageInfo.pageSize, docs: pagedItems, count: count };
    if (pageInfo === null || pageInfo === void 0 ? void 0 : pageInfo.pageSize)
        pageData.pages = Math.ceil(count / (pageInfo === null || pageInfo === void 0 ? void 0 : pageInfo.pageSize));
    return Object.assign(Object.assign({}, pageInfo), pageData);
};
// build product query
const getProductQuery = (fkey, ckey, value) => {
    let field = _1.CONSTANT.PRODUCT_FIELDS.find((f) => f.key == fkey);
    if (!field)
        return;
    let cond = _1.CONSTANT.PRODUCT_CONDITION(field === null || field === void 0 ? void 0 : field.field, value).find((c) => c.key == ckey);
    if (!cond)
        return;
    return cond.query;
};
// build submitable labels
const buildSubmitableLabel = (variantOptionValues) => {
    var _a, _b, _c, _d, _e, _f;
    let submitableLabels = [];
    let type1 = (_a = variantOptionValues[0]) === null || _a === void 0 ? void 0 : _a.type;
    let option1 = ((_b = variantOptionValues[0]) === null || _b === void 0 ? void 0 : _b.values) || [];
    let type2 = (_c = variantOptionValues[1]) === null || _c === void 0 ? void 0 : _c.type;
    let option2 = ((_d = variantOptionValues[1]) === null || _d === void 0 ? void 0 : _d.values) || [];
    let type3 = (_e = variantOptionValues[2]) === null || _e === void 0 ? void 0 : _e.type;
    let option3 = ((_f = variantOptionValues[2]) === null || _f === void 0 ? void 0 : _f.values) || [];
    for (let p1 of option1) {
        if (!(option2 === null || option2 === void 0 ? void 0 : option2.length))
            submitableLabels.push({ [type1]: p1 });
        for (let p2 of option2) {
            if (!(option3 === null || option3 === void 0 ? void 0 : option3.length))
                submitableLabels.push({ [type1]: p1, [type2]: p2 });
            for (let p3 of option3)
                submitableLabels.push({ [type1]: p1, [type2]: p2, [type3]: p3 });
        }
    }
    return submitableLabels;
};
const currentDate = new Date((0, moment_1.default)().format(_1.CONSTANT.DATE));
const getNumId = () => numId.generate(new Date().toJSON());
const getPaginationValidator = [
    (0, express_validator_1.query)("page", "Please enter valid page").optional().toInt().isInt({ gt: 0 }),
    (0, express_validator_1.query)("pageSize", "Please enter valid pageSize").optional().toInt().isInt({ gt: 0 }),
];
exports.default = {
    buildPath,
    loadEnvFile,
    buildResponse,
    checkPayloadFiles,
    handlePayloadError,
    buildError,
    sendOTP,
    checkUserRole,
    getHash,
    regxEscape,
    checkPagination,
    getPaginatedData,
    makePaginatedData,
    getProductQuery,
    buildSubmitableLabel,
    currentDate,
    getNumId,
    getPaginationValidator,
};
