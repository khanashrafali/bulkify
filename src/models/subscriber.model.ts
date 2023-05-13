import mongoose from "mongoose";

const Subscriber = new mongoose.Schema({ email: String }, { timestamps: true });

export default mongoose.model("subscribers", Subscriber);
