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
const models_1 = require("../models");
const utils_1 = require("../utils");
const addRole = (body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield models_1.roleModel.create(body);
    }
    catch (error) {
        throw error;
    }
});
const updateRole = (vid, body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let role = yield models_1.roleModel.findOne({ _id: vid });
        if (!role)
            throw utils_1.helper.buildError("no role found with this id", 404);
        return yield role.set(body).save();
    }
    catch (error) {
        throw error;
    }
});
const getRole = (vid) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let role = yield models_1.roleModel.findOne({ _id: vid });
        if (!role)
            throw utils_1.helper.buildError("no role found with this id", 404);
        return role;
    }
    catch (error) {
        throw error;
    }
});
const getRoles = (queryParams) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let conditions = {};
        return yield models_1.roleModel.find(conditions);
    }
    catch (error) {
        throw error;
    }
});
const deleteRole = (vid) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let role = yield models_1.roleModel.findOne({ _id: vid });
        if (!role)
            throw utils_1.helper.buildError("no role found with this id", 404);
        return yield role.delete();
    }
    catch (error) {
        throw error;
    }
});
exports.default = {
    addRole,
    updateRole,
    getRole,
    getRoles,
    deleteRole,
};
