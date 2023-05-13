import mongoose from "mongoose";
const mSlug = require("mongoose-slug-updater");

const Slider = new mongoose.Schema(
  {
    longSlider: {
      slides: {
        type: [
          {
            isImg: { type: Boolean, default: true },
            image: { type: Object },
            redirectUrl: { type: String, default: "" },
            product: { type: mongoose.SchemaTypes.ObjectId, ref: "products" },
          },
        ],
        default: [],
      },
    },
    shortSlider: {
      slides: {
        type: [
          {
            isImg: { type: Boolean, default: true },
            image: { type: Object },
            redirectUrl: { type: String, default: "" },
            product: { type: mongoose.SchemaTypes.ObjectId, ref: "products" },
          },
        ],
        default: [],
      },
    },
  },

  { timestamps: true }
);

Slider.plugin(mSlug);
export default mongoose.model("sliders", Slider);
