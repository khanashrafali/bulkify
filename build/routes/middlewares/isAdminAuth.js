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
exports.isAdmin = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const models_1 = require("../../models");
const utils_1 = require("../../utils");
const interfaces_1 = require("../../utils/interfaces");
const isAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let ReqData = req;
        let defaultPrifix = ["Bearer", "token"];
        let token = req.headers.authorization;
        let tokenPrifix;
        let authData;
        let authRole;
        tokenPrifix = token === null || token === void 0 ? void 0 : token.split(" ")[0];
        token = token === null || token === void 0 ? void 0 : token.split(" ")[1];
        if (!token)
            throw utils_1.helper.buildError("Please Login!", 401);
        if (!tokenPrifix || !defaultPrifix.includes(tokenPrifix)) {
            throw utils_1.helper.buildError(`Please add valid token prefix like ${defaultPrifix.join(",")}`, 401);
        }
        authData = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        let authUser = yield models_1.adminModel.findOne({ _id: authData.id });
        if (!authUser)
            throw utils_1.helper.buildError(`Unauthorize!`, 401);
        if (authUser)
            authRole = authUser.role;
        let userToJson = authUser.toJSON();
        if (userToJson.role == interfaces_1.UserRole.ADMIN && !userToJson.isActive)
            throw utils_1.helper.buildError("Your account is deactived by super admin", 400);
        ReqData.user = authUser;
        ReqData.role = authRole;
        req = ReqData;
        next();
    }
    catch (error) {
        let err = error;
        if (!error.statusCode)
            err = utils_1.helper.buildError("Please Login Again!", 401);
        next(err);
    }
});
exports.isAdmin = isAdmin;
