import { body, CustomValidator, oneOf, param, query } from "express-validator";
import validator from "validator";
import { contentModel } from "../../models";
import { CONSTANT, helper } from "../../utils";

const checkDuplicateTitle: CustomValidator = async (val, { req }) => {
  let conditions: any = {
    title: { $regex: new RegExp(`^${helper.regxEscape(val)}$`), $options: "i" },
  };

  let { contentIdOrSlug } = req.params as any;

  if (contentIdOrSlug) {
    let isId = validator.isMongoId(contentIdOrSlug);
    isId ? (conditions._id = { $ne: contentIdOrSlug }) : (conditions.slug = { $ne: contentIdOrSlug });
  }

  const content = await contentModel.findOne(conditions);
  if (content) throw helper.buildError("Same content title already exists", 400);
};

const isContentExists: CustomValidator = async (contentIdOrSlug, { req }) => {
  let isId = validator.isMongoId(contentIdOrSlug);
  let conditions: any = isId ? { _id: contentIdOrSlug } : { slug: contentIdOrSlug };
  const content = await contentModel.findOne(conditions);
  if (!content) throw helper.buildError("no content found with this id", 404);
};

const addContent: any[] = [
  body("title", "Please enter valid title").exists().trim().notEmpty().custom(checkDuplicateTitle),
  body("subTitle", "Please enter valid subTitle").exists().trim().notEmpty(),
  body("sortDescription", "Please enter valid sortDescription").exists().trim().notEmpty(),
  body("description", "Please enter valid description").exists().trim().notEmpty(),
  body("appDescription", "Please enter valid appDescription").exists().trim().notEmpty(),
];

const getContent = [param("contentIdOrSlug", "Please enter valid contentIdOrSlug").exists().custom(isContentExists)];

const deleteContent = [...getContent];

const updateContent: any[] = [...getContent, ...addContent];

const getContents = [...helper.getPaginationValidator];

export default {
  addContent,
  updateContent,
  deleteContent,
  getContent,
  getContents,
};
