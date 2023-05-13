"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const routes_1 = __importDefault(require("./routes/routes"));
const routes_2 = require("./swagger/routes");
const utils_1 = require("./utils");
let valid = true;
utils_1.helper.loadEnvFile();
const app = (0, express_1.default)();
app.set("views", utils_1.helper.buildPath("views"));
app.set("view engine", "ejs");
// handle cors
app.use((0, cors_1.default)());
// app.use((req: any, res: any, next: any) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Credentials", true);
//   res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });
// serve panel folder
// app.use("/", express.static(helper.buildPath("public", "user-panel")));
// serve public folder
app.use("/media", express_1.default.static(utils_1.helper.buildPath("public")));
// serve admin panel
// app.use("/admin-panel", express.static(helper.buildPath("public", "admin-panel")));
// serve vendor panel
// app.use("/vendor-panel", express.static(helper.buildPath("public", "vendor-panel")));
// parse json data middleware
app.use(express_1.default.json());
// parse url encoaded data middleware
app.use(express_1.default.urlencoded({ extended: false }));
app.use("/stop", (req, res, next) => {
    valid = !valid;
    next();
});
app.use("/", (req, res, next) => {
    if (!valid)
        res.status(401).send("UnAuthorize.");
    else
        next();
});
//load swagger
(0, routes_2.RegisterRoutes)(app);
app.use("/api-docs", swagger_ui_express_1.default.serve, (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.send(swagger_ui_express_1.default.generateHTML(yield Promise.resolve().then(() => __importStar(require("./swagger/swagger.json")))));
}));
// load app routes
app.use(routes_1.default);
// create connection to mongodb
utils_1.DB.then((rs) => {
    console.log("DB is connected.");
    app.listen(process.env.PORT, () => __awaiter(void 0, void 0, void 0, function* () {
        console.log(`server started on port ${process.env.PORT}`);
        // await email_handler.sentMail("faisalsistec@gmail.com", "Testing Project", "<h1>This is Testing</h1>");
        // console.log("sent");
    }));
}).catch((err) => console.log(JSON.stringify(err)));
// check qty place order
// increament cart qty issues
