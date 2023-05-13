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
const express_validator_1 = require("express-validator");
const utils_1 = require("../../utils");
const models_1 = require("../../models");
const interfaces_1 = require("../../utils/interfaces");
const allowedRoles = utils_1.CONSTANT.USER_ROLES.filter((v) => v != interfaces_1.UserRole.ADMIN);
const checkVariantName = (val, { req }) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let roleId = (_a = req.params) === null || _a === void 0 ? void 0 : _a.roleId;
    let conditions = { roleName: { $regex: utils_1.helper.regxEscape(val), $options: "i" } };
    if (roleId)
        conditions._id = { $ne: roleId };
    let v = yield models_1.roleModel.findOne(conditions);
    if (v)
        throw utils_1.helper.buildError("same role already exists", 400);
});
const getRole = [(0, express_validator_1.param)("roleId", "Please enter valid roleId").exists().isMongoId()];
const addRole = [
    (0, express_validator_1.body)("roleName", "Please enter valid roleName"),
    (0, express_validator_1.body)("permissions", "Please enter valid permissions").optional().isArray(),
    (0, express_validator_1.body)("permissions.*.module", `Please enter valid permissions module like ${utils_1.CONSTANT.ADMIN_MODULES.join(", ")}`)
        .exists()
        .isIn(utils_1.CONSTANT.ADMIN_MODULES),
    // body("permissions.*.read", "Please enter valid permissions read").exists().isBoolean(),
    // body("permissions.*.write", "Please enter valid permissions write").exists().isBoolean(),
    // body("permissions.*.delete", "Please enter valid permissions delete").optional().isBoolean(),
];
const updateRole = [...getRole, ...addRole];
const deleteRole = [...getRole];
const getRoles = [(0, express_validator_1.query)("category", "Please enter valid category").optional().isMongoId()];
exports.default = {
    addRole,
    updateRole,
    getRole,
    deleteRole,
    getRoles,
};
