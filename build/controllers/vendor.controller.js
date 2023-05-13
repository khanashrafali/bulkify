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
const express_validator_1 = require("express-validator");
const services_1 = require("../services");
const utils_1 = require("../utils");
/**
 * create vendor api
 */
const addVendor = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        yield services_1.vendorService.addVendor(req, req.body, res);
    }
    catch (error) {
        next(error);
    }
});
/**
 * update vendor api
 */
const updateVendor = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        let fileObj = req.files;
        yield services_1.vendorService.updateVendor(req.params.vendorId, req.body);
        utils_1.helper.buildResponse(res, "Vendor details updated successfully");
    }
    catch (error) {
        next(error);
    }
});
/**
 * update vendor api
 */
const updateVendorProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let avatar;
    try {
        utils_1.helper.handlePayloadError(req);
        yield services_1.vendorService.updateVendor(req.user._id.toString(), req.body);
        utils_1.helper.buildResponse(res, "Vendor details updated successfully");
    }
    catch (error) {
        next(error);
    }
});
/**
 * delete vendor api
 */
const deleteVendor = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        const result = yield services_1.vendorService.deleteVendor(req.params.vendorId);
        utils_1.helper.buildResponse(res, "Vendor deleted successfully", result);
    }
    catch (error) {
        next(error);
    }
});
/**
 * get single vendor api
 */
const getVendor = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        const result = yield services_1.vendorService.getVendor(req.params.vendorId);
        utils_1.helper.buildResponse(res, "Vendor fetched successfully", result);
    }
    catch (error) {
        next(error);
    }
});
/**
 * get vendor list api
 */
const getVendors = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield services_1.vendorService.getVendors(req.query);
        utils_1.helper.buildResponse(res, "Vendors fetched successfully", result);
    }
    catch (error) {
        next(error);
    }
});
/**
 * get vendor list by admin api
 */
const getVendorsByAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield services_1.vendorService.getVendorsByAdmin(req.query);
        utils_1.helper.buildResponse(res, "Vendors fetched successfully", result);
    }
    catch (error) {
        next(error);
    }
});
/**
 * update vendor status api
 */
const updateVendorStatus = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        const result = yield services_1.vendorService.updateVendorStatus(req.params.vendorId, req.body.status);
        utils_1.helper.buildResponse(res, "Vendor status updated successfully", result);
    }
    catch (error) {
        next(error);
    }
});
/**
 * update vendor status api
 */
const patchUpdateApproval = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        const result = yield services_1.vendorService.updateVendorApproval(req.params.vendorId, req.body.isApproved);
        utils_1.helper.buildResponse(res, "Vendor status updated successfully", result);
    }
    catch (error) {
        next(error);
    }
});
/**
 * complete vendor profile api
 */
const completeVendorProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        let fileObj = req.files;
        yield services_1.vendorService.completeVendorProfile(req, fileObj, req.body, res);
    }
    catch (error) {
        next(error);
    }
});
/**
 * became A Vendor
 */
const becameAVendor = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        let fileObj = req.files;
        yield services_1.vendorService.becameAVendor(req, fileObj, (0, express_validator_1.matchedData)(req), res);
    }
    catch (error) {
        next(error);
    }
});
const generateNewPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        yield services_1.vendorService.generateNewPassword(req.params.vendorId, res);
    }
    catch (error) {
        next(error);
    }
});
exports.default = {
    addVendor,
    updateVendor,
    getVendor,
    getVendors,
    deleteVendor,
    getVendorsByAdmin,
    updateVendorStatus,
    completeVendorProfile,
    patchUpdateApproval,
    becameAVendor,
    updateVendorProfile,
    generateNewPassword,
};
