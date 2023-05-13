import { sliderModel } from "../models";
import { fileHandler, helper } from "../utils";
import { IRequest } from "../utils/interfaces";

helper.loadEnvFile();

const addSlider = async (ireq: IRequest, slider: any[]) => {
  try {
    await sliderModel.create(slider);
  } catch (error) {
    throw error;
  }
};

const updateSlider = async (ireq: IRequest, sliderData: any) => {
  try {
    let slider = await sliderModel.findOne({});
    if (!slider) throw helper.buildError("no slider found with this id", 404);
    await slider.set(sliderData).save();
  } catch (error) {
    throw error;
  }
};

// delete slider info
const deleteSlider = async (ireq: IRequest, slideId: string) => {
  try {
    let slider = await sliderModel.findById(slideId);
    if (!slider) throw helper.buildError("No slider found with this id", 404);
    await slider.remove();
  } catch (error) {
    throw error;
  }
};

// delete slider slide info
const deleteSliderSlide = async (ireq: IRequest, sliderId: string, slideId: string) => {
  try {
    let slider = await sliderModel.findById(sliderId);
    if (!slider) throw helper.buildError("No slider found with this id", 404);
    let sliderObj: any = slider.toJSON();
    sliderObj.slides = sliderObj.slides.fliter((slide: any) => slide._id.toString() != slideId.toString());
    await slider.set({ ...sliderObj }).save();
  } catch (error) {
    throw error;
  }
};

// get slider info
const getSlider = async (queryParams: any) => {
  try {
    let data = await sliderModel
      .findOne({})
      .populate({ path: "longSlider.slides.product", select: "name" })
      .populate({ path: "shortSlider.slides.product", select: "name" });

    if (data) return data;

    return await sliderModel.create({ longSlider: { slides: [] }, shortSlider: { slides: [] } });
  } catch (error) {
    throw error;
  }
};

export default {
  addSlider,
  updateSlider,
  deleteSliderSlide,
  deleteSlider,
  getSlider,
};
