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
const getAdss = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('cdscvdsvdsvdsvdvdvdvd>');
        let result = yield services_1.adsService.getAdss(req.query);
        utils_1.helper.buildResponse(res, "Ads fetched Successfully", result);
    }
    catch (error) {
        next(error);
    }
});
const getAds = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('dvdsds');
        let result = yield services_1.adsService.getAds(req.params.adsId);
        utils_1.helper.buildResponse(res, "Ads fetched Successfully", result);
    }
    catch (error) {
        next(error);
    }
});
const addAds = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        utils_1.helper.checkPayloadFiles(req);
        let result = yield services_1.adsService.addAds(req.body, req.file);
        utils_1.helper.buildResponse(res, "Ads saved successfully", result);
    }
    catch (error) {
        next(error);
    }
});
const updateAds = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        let result = yield services_1.adsService.updateAds(req.params.adsId, req.body, req.file);
        utils_1.helper.buildResponse(res, "Ads updated Successfully", result);
    }
    catch (error) {
        next(error);
    }
});
const deleteAds = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let result = yield services_1.adsService.deleteAds(req.params.adsId);
        utils_1.helper.buildResponse(res, "Ads deleted successfully", result);
    }
    catch (error) {
        next(error);
    }
});
exports.default = {
    getAdss,
    getAds,
    addAds,
    updateAds,
    deleteAds,
};
