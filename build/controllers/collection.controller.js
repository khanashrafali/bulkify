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
 * create collection api
 */
const postAddCollection = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        yield services_1.collectionService.addCollection(req, req.body);
        utils_1.helper.buildResponse(res, "Collection created sucessfully");
    }
    catch (error) {
        next(error);
    }
});
/**
 * update collection api
 */
const putUpdateCollection = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        yield services_1.collectionService.updateCollection(req, req.params.collectionId, req.body);
        utils_1.helper.buildResponse(res, "Collection updated sucessfully");
    }
    catch (error) {
        next(error);
    }
});
/**
 * delete collection api
 */
const deleteCollection = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        yield services_1.collectionService.deleteCollection(req, req.params.collectionId);
        utils_1.helper.buildResponse(res, "Collection deleted sucessfully");
    }
    catch (error) {
        next(error);
    }
});
/**
 * get single collection api
 */
const getCollection = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        let result = yield services_1.collectionService.getCollection(req.params.collectionId);
        utils_1.helper.buildResponse(res, "Collection fetched sucessfully", result);
    }
    catch (error) {
        next(error);
    }
});
/**
 * get collection list api
 */
const getCollections = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        let result = yield services_1.collectionService.getCollections(req.query);
        utils_1.helper.buildResponse(res, "Collections fetched sucessfully", result);
    }
    catch (error) {
        next(error);
    }
});
/**
 * get collection list by admin api
 */
const getCollectionsByAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        let result = yield services_1.collectionService.getCollectionsByAdmin(req.query);
        utils_1.helper.buildResponse(res, "Collections fetched sucessfully", result);
    }
    catch (error) {
        next(error);
    }
});
/**
 * update collection status api
 */
const patchUpdateCollectionStatus = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        const result = yield services_1.collectionService.updateCollectionStatus(req.params.collectionId, req.body.status);
        utils_1.helper.buildResponse(res, "Collection status updated sucessfully", result);
    }
    catch (error) {
        next(error);
    }
});
/**
 * update collection featured status api
 */
const patchUpdateCollectionFeaturedStatus = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        const result = yield services_1.collectionService.updateCollectionFeaturedStatus(req.params.collectionId, req.body.isFeatured);
        utils_1.helper.buildResponse(res, "Collection status updated sucessfully", result);
    }
    catch (error) {
        next(error);
    }
});
exports.default = {
    postAddCollection,
    putUpdateCollection,
    deleteCollection,
    getCollection,
    getCollections,
    getCollectionsByAdmin,
    patchUpdateCollectionStatus,
    patchUpdateCollectionFeaturedStatus,
};
