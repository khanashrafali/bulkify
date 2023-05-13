import { body, param, query } from "express-validator";

const addSlider: any[] = [
  body("shortSlider.slides", "Please enter valid slides").optional().isArray({ min: 1 }),
  body("shortSlider.slides.*.isImg", "Please enter valid slide isImg"),
  body("shortSlider.slides.*.product", "Please enter valid slide product").optional().isMongoId(),
  body("shortSlider.slides.*.image", "Please enter valid slide image").optional(),
  body("shortSlider.slides.*.redirectUrl", "Please enter valid slide redirectUrl").optional().isURL(),

  body("longSlider.slides", "Please enter valid slides").optional().isArray({ min: 1 }),
  body("longSlider.slides.*.isImg", "Please enter valid slide isImg"),
  body("longSlider.slides.*.product", "Please enter valid slide product").optional().isMongoId(),
  body("longSlider.slides.*.image", "Please enter valid slide image").optional(),
  body("longSlider.slides.*.redirectUrl", "Please enter valid slide redirectUrl").optional().isURL(),
];

const getSlider = [query("sliderId", "Please enter valid sliderId").optional().isMongoId()];

const updateSlider = [...addSlider];

const deleteSliderSlide: any[] = [
  param("sliderId", "Please enter valid sliderId").exists().isMongoId(),
  param("slideId", "Please enter valid slide id").exists().isMongoId(),
];

const deleteSlider = [param("sliderId", "Please enter valid sliderId").exists().isMongoId()];

export default {
  addSlider,
  updateSlider,
  getSlider,
  deleteSliderSlide,
  deleteSlider,
};
