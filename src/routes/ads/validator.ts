import { body, param } from "express-validator";

const addAds = [
  body("location", "Please enter valid location like HOME, FILTER").exists().isIn(["HOME", "FILTER"]),
  body("redirectURL", "Please enter valid redirectURL").exists().isURL(),
  body("product", "Please enter valid product").optional().isMongoId(),
  body("category", "Please enter valid category").optional().isMongoId(),
  body("brand", "Please enter valid brand").optional().isMongoId(),
];

const getAds = [param("adsId", "Please enter valid adsId").exists().isMongoId()];
const updateAds = [...getAds, ...addAds];
const deleteAds = [...getAds];

export default {
  addAds,
  updateAds,
  deleteAds,
  getAds,
};
