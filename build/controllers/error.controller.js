"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// handle middleware errors
const errorHandler = (err, _, res, next) => {
    console.log(err);
    let message = err.message || "An Error Occured!";
    let statusCode = err.statusCode || 500;
    let status = err.status || false;
    let data = err.data || null;
    res.status(statusCode).json({ message, statusCode, status, data });
};
// handle api's 404 routes
const handle404 = (_, res, next) => {
    let message = "URL not Found!";
    let statusCode = 404;
    let status = false;
    let data = null;
    res.status(statusCode).json({ message, statusCode, status, data });
};
exports.default = {
    errorHandler,
    handle404,
};
