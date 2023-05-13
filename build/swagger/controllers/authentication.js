"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expressAuthentication = void 0;
function expressAuthentication(request, securityName, scopes) {
    if (securityName === "api_key")
        return Promise.resolve();
    return Promise.reject({});
}
exports.expressAuthentication = expressAuthentication;
