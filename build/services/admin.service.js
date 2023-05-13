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
const interfaces_1 = require("../utils/interfaces");
utils_1.helper.loadEnvFile();
/**
 * get Admin Users
 */
const getAdmins = (queryParams) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let conditions = { role: interfaces_1.UserRole.ADMIN };
        const pageInfo = utils_1.helper.checkPagination(queryParams);
        if ("textSearch" in queryParams) {
            let regex = { $regex: utils_1.helper.regxEscape(queryParams.textSearch), $options: "i" };
            conditions["$or"] = [{ name: regex }, { email: regex }];
        }
        if ("status" in queryParams)
            conditions.isActive = queryParams.status;
        if ("createdAt" in queryParams)
            conditions.date = queryParams.createdAt;
        let query = models_1.adminModel
            .find(conditions)
            .select("name email isActive date adminRole createdAt")
            .populate("adminRole")
            .sort({ createdAt: -1 })
            .lean();
        let count = yield models_1.userModel.countDocuments(conditions);
        let docs = [];
        if (pageInfo)
            docs = yield query.skip(pageInfo.skip).limit(pageInfo.pageSize);
        else
            docs = yield query;
        return utils_1.helper.makePaginatedData(docs, count, pageInfo);
    }
    catch (error) {
        throw error;
    }
});
/**
 * Create super admin
 */
const createSuperAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let superAdmin = yield models_1.adminModel.findOne({ role: interfaces_1.UserRole.SUPER_ADMIN });
        if (superAdmin)
            throw utils_1.helper.buildError("Super Admin Already exists!", 400);
        let password = yield bcryptjs_1.default.hash("Test@123", 12);
        return yield models_1.adminModel.create({
            name: "Manihar Super Admin",
            email: "test@test.com",
            password,
            role: interfaces_1.UserRole.SUPER_ADMIN,
            isApproved: interfaces_1.ApprovalStatus.APPROVED,
        });
    }
    catch (error) {
        throw error;
    }
});
/**
 * Add Sub Admin
 */
const addAdmin = (name, email, adminRole, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let user = yield models_1.adminModel.findOne({ email });
        if (user)
            throw utils_1.helper.buildError("Email already in use", 400);
        let password = randomstring_1.default.generate({ length: 8 });
        // let password = "Test@123";
        let hashPassword = yield bcryptjs_1.default.hash(password, 12);
        yield models_1.adminModel.create({ name, email, password: hashPassword, role: interfaces_1.UserRole.ADMIN, adminRole });
        utils_1.helper.buildResponse(res, "Admin added successfully");
        // send password to user email
        yield utils_1.emailHandler.sentInviteMailToAdmin(name, email, password);
    }
    catch (error) {
        throw error;
    }
});
/**
 * Update sub admin active status
 */
const updateAdminActiveStatus = (adminId, status) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let admin = yield models_1.adminModel.findOne({ _id: adminId, role: interfaces_1.UserRole.ADMIN });
        if (!admin)
            throw utils_1.helper.buildError("No admin found with this id", 404);
        yield admin.set({ isActive: status }).save();
    }
    catch (error) {
        throw error;
    }
});
const saveConfigInfo = (body) => __awaiter(void 0, void 0, void 0, function* () {
    let info = yield models_1.configModel.findOne({});
    if (info)
        yield info.set(body).save();
    else
        yield models_1.configModel.create(body);
});
const getConfigInfo = () => __awaiter(void 0, void 0, void 0, function* () {
    let data = yield models_1.configModel.findOne({}).lean();
    if (!data)
        return yield models_1.configModel.create({});
    return data;
});
const deleteAdmin = (adminId) => __awaiter(void 0, void 0, void 0, function* () {
    let admin = yield models_1.adminModel.findOne({ _id: adminId });
    if (!admin)
        throw utils_1.helper.buildError("no admin found with this id", 404);
    yield admin.delete();
});
exports.default = {
    getAdmins,
    createSuperAdmin,
    addAdmin,
    updateAdminActiveStatus,
    saveConfigInfo,
    getConfigInfo,
    deleteAdmin,
};
