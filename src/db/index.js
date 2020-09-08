import mongoose from "mongoose";
import logger from "../config";
import { config } from "dotenv";

config();

const url = process.env.ATLAS_URL;

mongoose.connect(url, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});
const connection = mongoose.connection;
connection.once("open", () => {
  logger.info("MongoDB database connected successfully");
});
