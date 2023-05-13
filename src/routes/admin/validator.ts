import { query, body, param } from "express-validator";
import { CONSTANT } from "../../utils";

const getUsers = [
  query("createdAt", "Please enter valid createdAt").optional().isDate({
    format: CONSTANT.DATE,
  }),
  query("isActive", "Please enter valid isActive").optional().isIn(["true", "false"]).toBoolean(),
  query("page", "Please enter valid page").optional().toInt().isInt({ gt: 0 }),
  query("pageSize", "Please enter valid pageSize").optional().toInt().isInt({ gt: 0 }),
  query("status", "Please enter valid status").optional().toBoolean(),
];

const postAddAdmin = [
  body("name", "Please enter valid name").exists().trim().notEmpty(),
  body("email", "Please enter valid email").exists().trim().notEmpty().isEmail().normalizeEmail(),
  body("adminRole", "Please enter valid adminRole").exists().isMongoId(),
];

const patchUpdateAdminActiveStatus = [
  param("adminId", "Please enter valid adminId").exists().isMongoId(),
  body("status", "Please enter valid status").exists().isBoolean(),
];

export default {
  getUsers,
  postAddAdmin,
  patchUpdateAdminActiveStatus,
};
