import { body, oneOf } from "express-validator";
import { CONSTANT, helper } from "../../utils";
import { UserRole } from "../../utils/interfaces";
import moment from "moment";
const allowedRoles = CONSTANT.USER_ROLES.filter((v) => v != UserRole.ADMIN);

export default {};
