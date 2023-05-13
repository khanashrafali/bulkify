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
 * create payout
 */
const postCreatePayout = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let ireq = req;
        utils_1.helper.handlePayloadError(req);
        let result = yield services_1.payoutService.postCreatePayout(ireq, req.body);
        utils_1.helper.buildResponse(res, "Payout created sucessfully", result);
    }
    catch (error) {
        next(error);
    }
});
/**
 * get payout
 */
const getPayout = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let ireq = req;
        utils_1.helper.handlePayloadError(req);
        let result = yield services_1.payoutService.getPayout(req.params.payoutId);
        utils_1.helper.buildResponse(res, "Fetch Payout sucessfully", result);
    }
    catch (error) {
        next(error);
    }
});
/**
 * get payouts
 */
const getPayouts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let ireq = req;
        utils_1.helper.handlePayloadError(req);
        let result = yield services_1.payoutService.getPayouts(ireq.query);
        utils_1.helper.buildResponse(res, "Fetch payouts sucessfully", result);
    }
    catch (error) {
        next(error);
    }
});
exports.default = {
    postCreatePayout,
    getPayout,
    getPayouts,
};
