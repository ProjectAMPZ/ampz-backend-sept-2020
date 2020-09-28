import mongoose from 'mongoose';
import { config } from 'dotenv';
import logger from '../config';

config();

const url = process.env.NODE_ENV === 'test'
  ? process.env.ATLAS_URL_TEST
  : process.env.ATLAS_URL;

mongoose.connect(url, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});
const { connection } = mongoose;
connection.once('open', () => {
  logger.info('MongoDB database connected successfully');
});
