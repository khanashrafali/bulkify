import { body } from "express-validator";

const saveQueiry = [
  body("name", "Please enter valid name").exists().trim().notEmpty(),
  body("email", "Please enter valid email").exists().trim().notEmpty().isEmail().normalizeEmail(),
  body("phone", "Please enter valid phone").exists().trim().notEmpty().isMobilePhone("en-IN"),
  body("message", "Please enter valid message").exists().trim().notEmpty(),
  body("subject", "Please enter valid subject").exists().trim().notEmpty(),
];

export default {
  saveQueiry,
};
