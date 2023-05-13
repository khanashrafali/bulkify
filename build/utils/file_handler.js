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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const crypto_1 = __importDefault(require("crypto"));
const promises_1 = __importDefault(require("fs/promises"));
const multer_1 = __importDefault(require("multer"));
const sharp_1 = __importDefault(require("sharp"));
const multer_sharp_s3_1 = __importDefault(require("multer-sharp-s3"));
const _1 = require(".");
_1.helper.loadEnvFile();
aws_sdk_1.default.config.update({
    secretAccessKey: process.env.AWS_SECRET_KEY,
    accessKeyId: process.env.AWS_ACCESS_KEY,
    region: process.env.AWS_REGION,
});
const s3 = new aws_sdk_1.default.S3();
const processImages = (files) => { var _a, files_1, files_1_1; return __awaiter(void 0, void 0, void 0, function* () {
    var _b, e_1, _c, _d;
    let uploadedFiles = [];
    try {
        for (_a = true, files_1 = __asyncValues(files); files_1_1 = yield files_1.next(), _b = files_1_1.done, !_b;) {
            _d = files_1_1.value;
            _a = false;
            try {
                let f = _d;
                let hash = yield new Promise((res, rej) => {
                    crypto_1.default.pseudoRandomBytes(16, (err, buf) => {
                        if (err)
                            rej(err);
                        res(buf.toString("hex"));
                    });
                });
                const imgProcess = (key, ins, width, height, quality = 50) => __awaiter(void 0, void 0, void 0, function* () {
                    let resizeInfo = { fit: "fill" };
                    if (height && width) {
                        resizeInfo.height = height;
                        resizeInfo.width = width;
                    }
                    let file = yield ins.resize(resizeInfo).toFormat("webp", { compression: "webp", quality: 50 }).toBuffer();
                    return (yield s3
                        .upload({
                        Bucket: process.env.AWS_BUCKET_NAME,
                        Key: `${hash}-${key}.webp`,
                        Body: file,
                    }, function (err, data) {
                        if (err)
                            throw err;
                        console.log(`File uploaded successfully. ${data.Location}`);
                    })
                        .promise()).Location;
                });
                let xlg = yield imgProcess("xlg", (0, sharp_1.default)(f.path), 1200, 1200);
                let lg = yield imgProcess("lg", (0, sharp_1.default)(f.path), 800, 800);
                let md = yield imgProcess("md", (0, sharp_1.default)(f.path), 500, 500);
                let sm = yield imgProcess("sm", (0, sharp_1.default)(f.path), 300, 300);
                let xs = yield imgProcess("xs", (0, sharp_1.default)(f.path), 100, 100);
                let original = yield imgProcess("original", (0, sharp_1.default)(f.path));
                uploadedFiles.push(Object.assign(Object.assign({}, f), { variant: { xlg, lg, md, sm, xs, original } }));
                yield promises_1.default.unlink(f.path);
            }
            finally {
                _a = true;
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (!_a && !_b && (_c = files_1.return)) yield _c.call(files_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return uploadedFiles;
}); };
// upload files to amazon s3
const uploadFile = (mimeTypes = []) => {
    try {
        return (0, multer_1.default)({
            limits: {
                fileSize: 1024 * 1042 * 1,
            },
            storage: multer_1.default.diskStorage({
                destination: (req, file, cb) => cb(null, _1.helper.buildPath("public", "uploads")),
                filename: (req, file, cb) => {
                    cb(null, file.originalname);
                },
            }),
            fileFilter: _fileFilter(mimeTypes),
        });
    }
    catch (error) {
        throw error;
    }
};
const deleteFile = (filePath) => __awaiter(void 0, void 0, void 0, function* () { return yield promises_1.default.unlink(filePath); });
// check file types
const _fileFilter = (mimeTypes) => (_, file, cb) => {
    console.log("mimetype", file === null || file === void 0 ? void 0 : file.mimetype);
    // if (mimeTypes.length && !mimeTypes.includes(file.mimetype)) {
    //   cb(helper.buildError(`please uplaod valid files like ${mimeTypes.join(",")}`, 400), false);
    //   return;
    // }
    cb(null, true);
};
// upload files to amazon s3
const uploadProductFilesToS3 = (folderName = null, mimeTypes = []) => {
    try {
        return (0, multer_1.default)({
            limits: {
                fileSize: 1024 * 1024 * 1,
            },
            storage: (0, multer_sharp_s3_1.default)({
                Key: function (req, file, cb) {
                    crypto_1.default.pseudoRandomBytes(16, (err, raw) => {
                        cb(err, err ? undefined : raw.toString("hex") + ".webp");
                    });
                },
                s3,
                Bucket: process.env.AWS_BUCKET_NAME,
                multiple: true,
                toFormat: { type: "webp", options: { progressive: true, quality: 50 } },
                resize: [
                    { suffix: "xlg", width: 1200, height: 1200, options: { fit: "fill" } },
                    { suffix: "lg", width: 800, height: 800, options: { fit: "fill" } },
                    { suffix: "md", width: 500, height: 500, options: { fit: "fill" } },
                    { suffix: "sm", width: 300, height: 300, options: { fit: "fill" } },
                    { suffix: "xs", width: 100, height: 100, options: { fit: "fill" } },
                    { suffix: "original" },
                ],
            }),
            fileFilter: _fileFilter(mimeTypes),
        });
    }
    catch (error) {
        throw error;
    }
};
// upload files to amazon s3
const uploadLongSliderFilesToS3 = (files) => { var _a, files_2, files_2_1; return __awaiter(void 0, void 0, void 0, function* () {
    var _b, e_2, _c, _d;
    try {
        let uploadedFiles = [];
        try {
            for (_a = true, files_2 = __asyncValues(files); files_2_1 = yield files_2.next(), _b = files_2_1.done, !_b;) {
                _d = files_2_1.value;
                _a = false;
                try {
                    let f = _d;
                    let hash = yield new Promise((res, rej) => {
                        crypto_1.default.pseudoRandomBytes(16, (err, buf) => {
                            if (err)
                                rej(err);
                            res(buf.toString("hex"));
                        });
                    });
                    const imgProcess = (key, ins, width, height, quality = 50) => __awaiter(void 0, void 0, void 0, function* () {
                        let resizeInfo = { fit: "fill" };
                        if (height && width) {
                            resizeInfo.height = height;
                            resizeInfo.width = width;
                        }
                        let file = yield ins.resize(resizeInfo).toFormat("webp", { compression: "webp", quality: 50 }).toBuffer();
                        return (yield s3
                            .upload({
                            Bucket: process.env.AWS_BUCKET_NAME,
                            Key: `${hash}-${key}.webp`,
                            Body: file,
                        }, function (err, data) {
                            if (err)
                                throw err;
                            console.log(`File uploaded successfully. ${data.Location}`);
                        })
                            .promise()).Location;
                    });
                    let xlg = yield imgProcess("xlg", (0, sharp_1.default)(f.path), 2000, 600);
                    let lg = yield imgProcess("lg", (0, sharp_1.default)(f.path), 1600, 500);
                    let md = yield imgProcess("md", (0, sharp_1.default)(f.path), 1200, 400);
                    let sm = yield imgProcess("sm", (0, sharp_1.default)(f.path), 1000, 300);
                    let xs = yield imgProcess("xs", (0, sharp_1.default)(f.path), 800, 200);
                    let original = yield imgProcess("original", (0, sharp_1.default)(f.path));
                    uploadedFiles.push(Object.assign(Object.assign({}, f), { variant: { xlg, lg, md, sm, xs, original } }));
                    yield promises_1.default.unlink(f.path);
                }
                finally {
                    _a = true;
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (!_a && !_b && (_c = files_2.return)) yield _c.call(files_2);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return uploadedFiles;
    }
    catch (error) {
        throw error;
    }
}); };
const uploadShortSliderFilesToS3 = (files) => { var _a, files_3, files_3_1; return __awaiter(void 0, void 0, void 0, function* () {
    var _b, e_3, _c, _d;
    try {
        let uploadedFiles = [];
        try {
            for (_a = true, files_3 = __asyncValues(files); files_3_1 = yield files_3.next(), _b = files_3_1.done, !_b;) {
                _d = files_3_1.value;
                _a = false;
                try {
                    let f = _d;
                    let hash = yield new Promise((res, rej) => {
                        crypto_1.default.pseudoRandomBytes(16, (err, buf) => {
                            if (err)
                                rej(err);
                            res(buf.toString("hex"));
                        });
                    });
                    const imgProcess = (key, ins, width, height, quality = 50) => __awaiter(void 0, void 0, void 0, function* () {
                        let resizeInfo = { fit: "fill" };
                        if (height && width) {
                            resizeInfo.height = height;
                            resizeInfo.width = width;
                        }
                        let file = yield ins.resize(resizeInfo).toFormat("webp", { compression: "webp", quality: 50 }).toBuffer();
                        return (yield s3
                            .upload({
                            Bucket: process.env.AWS_BUCKET_NAME,
                            Key: `${hash}-${key}.webp`,
                            Body: file,
                        }, function (err, data) {
                            if (err)
                                throw err;
                            console.log(`File uploaded successfully. ${data.Location}`);
                        })
                            .promise()).Location;
                    });
                    let xlg = yield imgProcess("xlg", (0, sharp_1.default)(f.path), 1000, 830);
                    let lg = yield imgProcess("lg", (0, sharp_1.default)(f.path), 600, 430);
                    let md = yield imgProcess("md", (0, sharp_1.default)(f.path), 500, 330);
                    let sm = yield imgProcess("sm", (0, sharp_1.default)(f.path), 400, 230);
                    let xs = yield imgProcess("xs", (0, sharp_1.default)(f.path), 200, 80);
                    let original = yield imgProcess("original", (0, sharp_1.default)(f.path));
                    uploadedFiles.push(Object.assign(Object.assign({}, f), { variant: { xlg, lg, md, sm, xs, original } }));
                    yield promises_1.default.unlink(f.path);
                }
                finally {
                    _a = true;
                }
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (!_a && !_b && (_c = files_3.return)) yield _c.call(files_3);
            }
            finally { if (e_3) throw e_3.error; }
        }
        return uploadedFiles;
    }
    catch (error) {
        throw error;
    }
}); };
const uploadAdsFilesToS3 = (folderName = null, mimeTypes = []) => {
    try {
        return (0, multer_1.default)({
            limits: {
                fileSize: 1024 * 1024 * 1,
            },
            storage: (0, multer_sharp_s3_1.default)({
                Key: function (req, file, cb) {
                    crypto_1.default.pseudoRandomBytes(16, (err, raw) => {
                        cb(err, err ? undefined : raw.toString("hex") + ".webp");
                    });
                },
                s3,
                Bucket: process.env.AWS_BUCKET_NAME,
                multiple: true,
                toFormat: "webp",
                resize: [
                    { suffix: "xlg", height: 600, width: 2000 },
                    { suffix: "lg", height: 500, width: 1600 },
                    { suffix: "md", height: 400, width: 1200 },
                    { suffix: "sm", height: 300, width: 1000 },
                    { suffix: "xs", height: 200, width: 800 },
                    { suffix: "original" },
                ],
            }),
            fileFilter: _fileFilter(mimeTypes),
        });
    }
    catch (error) {
        throw error;
    }
};
const uploadBrandAndCategoryFilesToS3 = (folderName = null, mimeTypes = []) => {
    try {
        return (0, multer_1.default)({
            limits: {
                fileSize: 1024 * 1024 * 1,
            },
            storage: (0, multer_sharp_s3_1.default)({
                Key: function (req, file, cb) {
                    crypto_1.default.pseudoRandomBytes(16, (err, raw) => {
                        cb(err, err ? undefined : raw.toString("hex") + ".webp");
                    });
                },
                s3,
                Bucket: process.env.AWS_BUCKET_NAME,
                multiple: true,
                resize: [
                    { suffix: "xlg", width: 1200, height: 1000 },
                    { suffix: "lg", width: 800, height: 700 },
                    { suffix: "md", width: 500, height: 400 },
                    { suffix: "sm", width: 300, height: 200 },
                    { suffix: "xs", width: 100, height: 100 },
                    { suffix: "original" },
                ],
                toFormat: "webp",
            }),
            fileFilter: _fileFilter(mimeTypes),
        });
    }
    catch (error) {
        throw error;
    }
};
// delete files from amazon s3
const deleteFromS3 = (fileLocation) => {
    const fileKey = fileLocation === null || fileLocation === void 0 ? void 0 : fileLocation.replace(`${process.env.AWS_BUCKET_KEY}/`, "");
    return new Promise((res, rej) => {
        if (!fileKey)
            res(false);
        var params = { Bucket: process.env.AWS_BUCKET_NAME, Key: fileKey };
        s3.deleteObject(params, function (err, data) {
            if (err) {
                console.log(err, err.stack);
                rej(err);
            }
            else {
                res(true);
                console.log("file deleted"); // deleted
            }
        });
    });
};
exports.default = {
    uploadBrandAndCategoryFilesToS3,
    uploadProductFilesToS3,
    uploadShortSliderFilesToS3,
    uploadLongSliderFilesToS3,
    uploadAdsFilesToS3,
    deleteFromS3,
    uploadFile,
    deleteFile,
    processImages,
};
