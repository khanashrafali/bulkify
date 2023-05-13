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
Object.defineProperty(exports, "__esModule", { value: true });
const services_1 = require("../services");
const utils_1 = require("../utils");
/**
 * get app admin users api
 */
const getAdminUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        let result = yield services_1.adminService.getAdmins(req.query);
        utils_1.helper.buildResponse(res, "Admin Users fetched sucessfully", result);
    }
    catch (error) {
        next(error);
    }
});
const postAddAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        yield services_1.adminService.addAdmin(req.body.name, req.body.email, req.body.adminRole, res);
    }
    catch (error) {
        next(error);
    }
});
const patchUpdateAdminActiveStatus = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        let result = yield services_1.adminService.updateAdminActiveStatus(req.params.adminId, req.body.status);
        return utils_1.helper.buildResponse(res, "Admin status updated", result);
    }
    catch (error) {
        next(error);
    }
});
const saveConfigInfo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        let result = yield services_1.adminService.saveConfigInfo(req.body);
        return utils_1.helper.buildResponse(res, "Config Info Updated.", result);
    }
    catch (error) {
        next(error);
    }
});
const getConfigInfo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        let result = yield services_1.adminService.getConfigInfo();
        return utils_1.helper.buildResponse(res, "Fetched Config Info.", result);
    }
    catch (error) {
        next(error);
    }
});
const deleteAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        let result = yield services_1.adminService.deleteAdmin(req.params.adminId);
        return utils_1.helper.buildResponse(res, "Admin deleted successfully", result);
    }
    catch (error) {
        next(error);
    }
});
exports.default = {
    getAdminUsers,
    postAddAdmin,
    patchUpdateAdminActiveStatus,
    saveConfigInfo,
    getConfigInfo,
    deleteAdmin,
};
