"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decrypt = exports.encrypt = void 0;
const crypto_1 = __importDefault(require("crypto"));
const encrypt = (plainText, workingKey) => {
    var m = crypto_1.default.createHash('md5');
    m.update(workingKey);
    var key = m.digest('base64');
    let key_in_bytes = Buffer.from(key, "base64");
    var iv = '\x00\x01\x02\x03\x04\x05\x06\x07\x08\x09\x0a\x0b\x0c\x0d\x0e\x0f';
    var cipher = crypto_1.default.createCipheriv('aes-128-cbc', key_in_bytes, iv);
    var encoded = cipher.update(plainText, 'utf8', 'hex');
    encoded += cipher.final('hex');
    return encoded;
};
exports.encrypt = encrypt;
const decrypt = (encText, workingKey) => {
    var m = crypto_1.default.createHash('md5');
    m.update(workingKey);
    var key = m.digest('base64');
    let key_in_bytes = Buffer.from(key, "base64");
    var iv = '\x00\x01\x02\x03\x04\x05\x06\x07\x08\x09\x0a\x0b\x0c\x0d\x0e\x0f';
    var decipher = crypto_1.default.createDecipheriv('aes-128-cbc', key_in_bytes, iv);
    var decoded = decipher.update(encText, 'hex', 'utf8');
    decoded += decipher.final('utf8');
    return decoded;
};
exports.decrypt = decrypt;
