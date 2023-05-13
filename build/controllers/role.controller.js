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
const addRole = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        let result = yield services_1.roleService.addRole(req.body);
        return utils_1.helper.buildResponse(res, "Role Added", result);
    }
    catch (error) {
        next(error);
    }
});
const updateRole = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        let result = yield services_1.roleService.updateRole(req.params.roleId, req.body);
        return utils_1.helper.buildResponse(res, "Role Updated", result);
    }
    catch (error) {
        next(error);
    }
});
const getRole = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        let result = yield services_1.roleService.getRole(req.params.roleId);
        return utils_1.helper.buildResponse(res, "Fetched Role", result);
    }
    catch (error) {
        next(error);
    }
});
const getRoles = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        let result = yield services_1.roleService.getRoles(req.query);
        return utils_1.helper.buildResponse(res, "Fetched Roles", result);
    }
    catch (error) {
        next(error);
    }
});
const deleteRole = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        let result = yield services_1.roleService.deleteRole(req.params.roleId);
        return utils_1.helper.buildResponse(res, "Role Deleted", result);
    }
    catch (error) {
        next(error);
    }
});
exports.default = {
    addRole,
    updateRole,
    getRole,
    deleteRole,
    getRoles,
};
