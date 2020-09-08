import { config } from "dotenv";
import express from "express";
import morgan from "morgan";
import logger from "./config";
import "./db";

// import v1Router from './routes';

// initialize process.env variables
config();

const app = express();
const port = process.env.PORT || 5000;
global.logger = logger;

app.use(morgan("combined", { stream: logger.stream }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/api/v1", (req, res) =>
  res.status(200).json({ status: "success", message: "Welcome to AMPZ" })
);
// v1Router(app);

app.use((req, res, next) => {
  const err = new Error("No endpoint found");
  err.status = 404;
  next(err);
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  logger.error(
    `${err.status || 500} - ${err.message} - ${req.originalUrl} - ${
      req.method
    } - ${req.ip}`
  );
  res.status(err.status || 500).json({
    status: "error",
    error: {
      message: err.message || "Internal Server Error",
    },
  });
});

app.listen(port, () => {
  logger.info(`Server running at port ${port}`);
});

export default app;
