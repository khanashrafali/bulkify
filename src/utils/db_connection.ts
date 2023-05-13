import mongoose from "mongoose";
import helper from "./helpers";

helper.loadEnvFile();

// create connection to mongodb
export default mongoose.connect(process.env.DB_URI as string, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true });
