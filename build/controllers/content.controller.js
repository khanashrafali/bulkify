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
 * add content
 */
const addContent = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        yield services_1.contentService.addContent(req.body);
        utils_1.helper.buildResponse(res, "Content added successfully");
    }
    catch (error) {
        next(error);
    }
});
/**
 * update content
 */
const updateContent = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        yield services_1.contentService.updateContent(req.params.contentIdOrSlug, req.body);
        utils_1.helper.buildResponse(res, "Content updated successfully");
    }
    catch (error) {
        next(error);
    }
});
/**
 * delete content api
 */
const deleteContent = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        const result = yield services_1.contentService.deleteContent(req.params.contentIdOrSlug);
        utils_1.helper.buildResponse(res, "Content deleted successfully", result);
    }
    catch (error) {
        next(error);
    }
});
/**
 * get content api
 */
const getContent = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        const result = yield services_1.contentService.getContent(req.params.contentIdOrSlug);
        utils_1.helper.buildResponse(res, "Content fetched successfully", result);
    }
    catch (error) {
        next(error);
    }
});
/**
 * get content list api
 */
const getContents = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        const result = yield services_1.contentService.getContents(req.query);
        utils_1.helper.buildResponse(res, "Content fetched successfully", result);
    }
    catch (error) {
        next(error);
    }
});
exports.default = {
    addContent,
    updateContent,
    getContent,
    deleteContent,
    getContents,
};
