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
const utils_1 = require("../utils");
/**
 * get product helper constants data api
 */
const getProductUtils = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.buildResponse(res, "Product utils fetched sucessfully", {
            fields: utils_1.CONSTANT.PRODUCT_FIELDS,
            conditions: utils_1.CONSTANT.PRODUCT_CONDITION(),
        });
    }
    catch (error) {
        next(error);
    }
});
/**
 * get filter dorpdown
 */
const getFetchFilterDropdown = (req, res, next) => {
    try {
        return utils_1.helper.buildResponse(res, "Filter dropdown fetched sucessfully", utils_1.CONSTANT.FILTER_DROPDOWN);
    }
    catch (error) {
        next(error);
    }
};
const getAdminModules = (req, res, next) => {
    try {
        utils_1.helper.buildResponse(res, "Fetched admin modules", utils_1.CONSTANT.ADMIN_MODULES);
    }
    catch (error) {
        throw error;
    }
};
exports.default = {
    getProductUtils,
    getFetchFilterDropdown,
    getAdminModules,
};
