"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CONF = void 0;
var ENV_FILE;
(function (ENV_FILE) {
    ENV_FILE["STAGE"] = "stage.env";
    ENV_FILE["PROD"] = "prod.env";
    ENV_FILE["LOCAL"] = ".env";
})(ENV_FILE || (ENV_FILE = {}));
// set which envirnment file do you want to load
exports.CONF = { envFile: ENV_FILE.STAGE };
