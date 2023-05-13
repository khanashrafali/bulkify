import mongoose from "mongoose";
import mongooseDelete from "mongoose-delete";
const mSlug = require("mongoose-slug-updater");

const UserFeedback = new mongoose.Schema(
  {
    name: String,
    email: String,
    phone: String,
  },
  { timestamps: true }
);

UserFeedback.plugin(mongooseDelete, { overrideMethods: true });
UserFeedback.plugin(mSlug);

export default mongoose.model("user-feedback", UserFeedback);
