"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.swagger = void 0;
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
// import { helper } from "../utils";
// helper.loadEnvFile();
const swagger = (app) => {
    // const swaggerDocument = {
    //   openapi: "3.0.1",
    //   info: {
    //     version: "1.0.0",
    //     title: "Vasaas APIs Document",
    //     description: "Description of Apis",
    //     termsOfService: "",
    //     contact: {
    //       name: "Vasaas",
    //       email: "noreply@gmail.com",
    //       url: process.env.BASE_URL,
    //     },
    //     license: {
    //       name: "Apache 2.0",
    //       url: "https://www.apache.org/licenses/LICENSE-2.0.html",
    //     },
    //   },
    //   servers: [
    //     {
    //       url: `${process.env.LOCAL_URL}/api/v1`,
    //       description: "Local Environment",
    //     },
    //     {
    //       url: `${process.env.STAGE_URL}/api/v1`,
    //       description: "Stage Environment",
    //     },
    //     {
    //       url: `${process.env.PROD_URL}/api/v1`,
    //       description: "Production Environment",
    //     },
    //   ],
    //   components: {
    //     schemas: {},
    //     securitySchemes: {
    //       bearerAuth: {
    //         type: "http",
    //         scheme: "bearer",
    //         name: "Authorization",
    //         in: "header",
    //         bearerFormat: "JWT",
    //       },
    //     },
    //   },
    //   tags: [
    //     Tags.authTag,
    //     Tags.categoryTag,
    //     Tags.subCategoryTag,
    //     Tags.vendorTag,
    //     Tags.collectionTag,
    //     Tags.brandTag,
    //     Tags.productTag,
    //     Tags.cartTag,
    //     Tags.orderTag,
    //     Tags.userTag,
    //     Tags.couponTag,
    //     Tags.reviewTag,
    //     Tags.sliderTag,
    //   ],
    //   paths: paths,
    //   schemes: ["http", "https"],
    //   consumes: ["application/json"],
    //   produces: ["application/json"],
    // };
    // app.use("/api/v1/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));
    app.use("/docs", swagger_ui_express_1.default.serve, (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
        return res.send(swagger_ui_express_1.default.generateHTML(yield Promise.resolve().then(() => __importStar(require("./swagger.json")))));
    }));
};
exports.swagger = swagger;
