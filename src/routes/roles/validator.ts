import { body, CustomValidator, oneOf, param, query } from "express-validator";
import { CONSTANT, helper } from "../../utils";
import { roleModel } from "../../models";
import { UserRole } from "../../utils/interfaces";
import moment from "moment";
const allowedRoles = CONSTANT.USER_ROLES.filter((v) => v != UserRole.ADMIN);

const checkVariantName: CustomValidator = async (val, { req }) => {
  let roleId = req.params?.roleId;
  let conditions: any = { roleName: { $regex: helper.regxEscape(val), $options: "i" } };
  if (roleId) conditions._id = { $ne: roleId };
  let v = await roleModel.findOne(conditions);
  if (v) throw helper.buildError("same role already exists", 400);
};

const getRole: any[] = [param("roleId", "Please enter valid roleId").exists().isMongoId()];

const addRole: any[] = [
  body("roleName", "Please enter valid roleName"),
  body("permissions", "Please enter valid permissions").optional().isArray(),
  body("permissions.*.module", `Please enter valid permissions module like ${CONSTANT.ADMIN_MODULES.join(", ")}`)
    .exists()
    .isIn(CONSTANT.ADMIN_MODULES),
  // body("permissions.*.read", "Please enter valid permissions read").exists().isBoolean(),
  // body("permissions.*.write", "Please enter valid permissions write").exists().isBoolean(),
  // body("permissions.*.delete", "Please enter valid permissions delete").optional().isBoolean(),
];

const updateRole: any[] = [...getRole, ...addRole];
const deleteRole: any[] = [...getRole];
const getRoles: any[] = [query("category", "Please enter valid category").optional().isMongoId()];

export default {
  addRole,
  updateRole,
  getRole,
  deleteRole,
  getRoles,
};
