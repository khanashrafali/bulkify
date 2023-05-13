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
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const randomstring_1 = __importDefault(require("randomstring"));
const models_1 = require("../models");
const utils_1 = require("../utils");
utils_1.helper.loadEnvFile();
/**
 * create vender handler
 */
const addVendor = (req, body, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield models_1.userModel.findOne({ mobileNumber: body.mobileNumber });
        if (user)
            throw utils_1.helper.buildError("This mobile number or email already in use", 400);
        const randomPassword = randomstring_1.default.generate({ length: 8 });
        const password = yield bcryptjs_1.default.hash(randomPassword, 12);
        let data = Object.assign(Object.assign({}, body), { isActive: true, isMobileVerified: true, isEmailVerified: true, isProfileComplete: true, password });
        yield models_1.vendorModel.create(data);
        utils_1.helper.buildResponse(res, "Vendor registered successfully");
        // await emailHandler.sentVendorInvitationMail(body.businessEmail, body.name);
        yield utils_1.emailHandler.sentVendorInvitationMail(body.name, body.email, randomPassword);
    }
    catch (error) {
        throw error;
    }
});
/**
 * update vender handler
 */
const updateVendor = (vendorId, body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const vendor = yield models_1.vendorModel.findOne({ _id: vendorId });
        if (!vendor)
            throw utils_1.helper.buildError("No vendor found with this id", 404);
        yield vendor.set(body).save();
    }
    catch (error) {
        throw error;
    }
});
/**
 * get vender handler
 */
const getVendor = (vendorId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let vendor = yield models_1.vendorModel.findOne({ _id: vendorId }).lean();
        if (!vendor)
            throw utils_1.helper.buildError("No vendor found with this id", 404);
        return vendor;
    }
    catch (error) {
        throw error;
    }
});
/**
 * delete vender handler
 */
const deleteVendor = (vendorId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let vendor = yield models_1.vendorModel.findOne({ _id: vendorId });
        if (!vendor)
            throw utils_1.helper.buildError("No vendor found with this id", 404);
        yield vendor.delete();
    }
    catch (error) {
        throw error;
    }
});
/**
 * get vender list handler
 */
const getVendors = (queryParams) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let conditions = { isActive: true };
        let { textSearch, isProfileComplete, isActive, createdAt, isApproved } = queryParams;
        const pageInfo = utils_1.helper.checkPagination(queryParams);
        if (textSearch) {
            conditions["$or"] = [
                { name: { $regex: utils_1.helper.regxEscape(textSearch), $options: "i" } },
                { email: { $regex: utils_1.helper.regxEscape(textSearch), $options: "i" } },
                { mobileNumber: { $regex: utils_1.helper.regxEscape(textSearch), $options: "i" } },
                { businessEmail: { $regex: utils_1.helper.regxEscape(textSearch), $options: "i" } },
                { businessName: { $regex: utils_1.helper.regxEscape(textSearch), $options: "i" } },
            ];
        }
        if (isProfileComplete)
            conditions.isProfileComplete = isProfileComplete;
        if (isActive)
            conditions.isActive = isActive;
        if (createdAt)
            conditions.date = new Date(createdAt);
        if (isApproved)
            conditions.isApproved = isApproved;
        let docs = [];
        let mongoQuery = models_1.vendorModel.find(conditions).sort({ createdAt: -1 });
        const count = yield models_1.vendorModel.countDocuments(conditions);
        if (pageInfo)
            docs = yield mongoQuery.skip(pageInfo.skip).limit(pageInfo.pageSize);
        else
            docs = yield mongoQuery;
        return utils_1.helper.makePaginatedData(docs, count, pageInfo);
    }
    catch (error) {
        throw error;
    }
});
/**
 * get vender list by admin handler
 */
const getVendorsByAdmin = (queryParams) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let conditions = {};
        let { textSearch, isProfileComplete, isActive, createdAt, isApproved } = queryParams;
        const pageInfo = utils_1.helper.checkPagination(queryParams);
        if (textSearch) {
            conditions["$or"] = [
                { name: { $regex: utils_1.helper.regxEscape(textSearch), $options: "i" } },
                { email: { $regex: utils_1.helper.regxEscape(textSearch), $options: "i" } },
                { mobileNumber: { $regex: utils_1.helper.regxEscape(textSearch), $options: "i" } },
                { businessEmail: { $regex: utils_1.helper.regxEscape(textSearch), $options: "i" } },
                { businessName: { $regex: utils_1.helper.regxEscape(textSearch), $options: "i" } },
            ];
        }
        if (isProfileComplete)
            conditions.isProfileComplete = isProfileComplete;
        if (isActive)
            conditions.isActive = isActive;
        if (createdAt)
            conditions.date = new Date(createdAt);
        if (isApproved)
            conditions.isApproved = isApproved;
        let docs = [];
        let mongoQuery = models_1.vendorModel.find(conditions).sort({ createdAt: -1 });
        const count = yield models_1.vendorModel.countDocuments(conditions);
        if (pageInfo)
            docs = yield mongoQuery.skip(pageInfo.skip).limit(pageInfo.pageSize);
        else
            docs = yield mongoQuery;
        return utils_1.helper.makePaginatedData(docs, count, pageInfo);
    }
    catch (error) {
        throw error;
    }
});
/**
 * update vender status handler
 */
const updateVendorStatus = (vendorId, isActive) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let vendor = yield models_1.vendorModel.findOne({ _id: vendorId });
        if (!vendor)
            throw utils_1.helper.buildError("No vendor found with this id", 404);
        yield vendor.set({ isActive }).save();
    }
    catch (error) {
        throw error;
    }
});
/**
 * update vender status handler
 */
const updateVendorApproval = (vendorId, isApproved) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let vendor = yield models_1.vendorModel.findOne({ _id: vendorId });
        if (!vendor)
            throw utils_1.helper.buildError("No vendor found with this id", 404);
        yield vendor.set({ isApproved }).save();
    }
    catch (error) {
        throw error;
    }
});
/**
 * complete vender profile handler
 */
const completeVendorProfile = (req, fileObj, body, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        // let pickupLocation = await shiprocketService.getPickupAddress(body.pickupLocation);
        let avatar = (_a = fileObj.avatar[0]) === null || _a === void 0 ? void 0 : _a.Location;
        let images = fileObj.images.map((f) => f.Location);
        let video = (_b = fileObj.video[0]) === null || _b === void 0 ? void 0 : _b.Location;
        yield req.user
            .set(Object.assign(Object.assign({}, body), { avatar,
            images,
            video, isProfileComplete: true, isActive: true, bankDetails: {
                accountHolderName: body.accountHolderName,
                ifscCode: body.ifscCode,
                bankName: body.bankName,
                accountNumber: body.accountNumber,
            } }))
            .save();
        utils_1.helper.buildResponse(res, "Profile completed");
        // await emailHandler.sentVendorInvitationMail(body.businessEmail, body.businessName);
    }
    catch (error) {
        throw error;
    }
});
/**
 * became A Vendor handler
 */
const becameAVendor = (req, fileObj, body, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d, _e, _f, _g;
    try {
        if (!((_c = fileObj.avatar) === null || _c === void 0 ? void 0 : _c.length)) {
            throw utils_1.helper.buildError("avatar is required", 400);
        }
        if (!((_d = fileObj.images) === null || _d === void 0 ? void 0 : _d.length)) {
            throw utils_1.helper.buildError("images is required", 400);
        }
        if (!((_e = fileObj.video) === null || _e === void 0 ? void 0 : _e.length)) {
            throw utils_1.helper.buildError("video is required", 400);
        }
        let avatar = (_f = fileObj.avatar[0]) === null || _f === void 0 ? void 0 : _f.Location;
        let images = fileObj.images.map((f) => f.Location);
        let video = (_g = fileObj.video[0]) === null || _g === void 0 ? void 0 : _g.Location;
        const randomPassword = randomstring_1.default.generate({ length: 8 });
        const password = yield bcryptjs_1.default.hash(randomPassword, 12);
        // const varificationToken = helper.getHash();
        // const expirationTime = moment(moment()).add(5, "minutes");
        yield models_1.vendorModel.create(Object.assign(Object.assign({}, body), { avatar,
            images,
            video, isProfileComplete: true, isActive: false, password, bankDetails: {
                accountHolderName: body.accountHolderName,
                ifscCode: body.ifscCode,
                bankName: body.bankName,
                accountNumber: body.accountNumber,
            } }));
        utils_1.helper.buildResponse(res, "Your profile is under review, notify you when it's approved.");
        yield utils_1.emailHandler.sentVendorInvitationMail(body.name, body.email, randomPassword);
    }
    catch (error) {
        throw error;
    }
});
const generateNewPassword = (vendorId, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let vendor = yield models_1.vendorModel.findOne({ _id: vendorId });
        if (!vendor)
            throw utils_1.helper.buildError("no vendor found with this id", 404);
        const randomPassword = randomstring_1.default.generate({ length: 8 });
        const password = yield bcryptjs_1.default.hash(randomPassword, 12);
        let vendorObj = vendor.toJSON();
        yield vendor.set({ password }).save();
        utils_1.helper.buildResponse(res, "New Password Generate Successfully.");
        yield utils_1.emailHandler.resetPasswordByAdminVendorTamplate(vendorObj.name, vendorObj.email, randomPassword);
    }
    catch (error) {
        throw error;
    }
});
exports.default = {
    addVendor,
    updateVendor,
    getVendor,
    getVendors,
    deleteVendor,
    updateVendorStatus,
    getVendorsByAdmin,
    completeVendorProfile,
    updateVendorApproval,
    becameAVendor,
    generateNewPassword,
};
