import express from "express";
import cors from "cors";
import { config } from "dotenv";
import morgan from "morgan";
import logger from "./config";
import "./db";
import v1Router from "./routes";
import Message from "./db/models/message.model";

config();

const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

global.logger = logger;
app.use(cors());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(morgan("combined", { stream: logger.stream }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/api/v1", (req, res) =>
  res.status(200).json({ status: "success", message: "Welcome to AMPZ API" })
);
//mount router
app.use("/api/v1", v1Router);

app.use((req, res, next) => {
  const err = new Error("No endpoint found");
  err.status = 404;
  next(err);
});

app.use((err, req, res) => {
  res.status(err.status || 500).json({
    status: "error",
    error: {
      message: err.message || "Internal Server Error",
    },
  });
});

io.on("connection", (socket) => {
  socket.on("addUsers", async (data) => {
    let user = await Message.findOne({
      userId: data.userId,
    });
    if (!user) {
      user = new Message({
        users: data.users,
        userId: data.userId,
      });
      await user.save();
    }
    user.update({
      $set: { users: user.users.concat(data.users) },
    });
  });
  // socket.on("Message", async (msg) => {
  //   // try {
  //   //   const newChat = await Chat.create(msg);
  //   //   const chat = await Chat.find({ _id: newChat._id }).populate("sender");
  //   //   return io.emit("OutputMessage", chat);
  //   // } catch (err) {
  //   //   logger.error(err.message);
  //   // }
  //   // try {
  //   //   let chat = new Chat({
  //   //     message: msg.Message,
  //   //     sender: msg.userId,
  //   //     type: msg.type,
  //   //   });
  //   //   await chat.save((err, doc) => {
  //   //     console.log(doc);
  //   //     if (err) return res.json({ success: false, err });
  //   //     Chat.find({ _id: doc._id })
  //   //       .populate("sender")
  //   //       .exec((err, doc) => {
  //   //         return io.emit("OutputMessage", doc);
  //   //       });
  //   //   });
  //   // } catch (error) {
  //   //   console.error(error);
  //   // }
  // });
});

const port = process.env.PORT || 5000;

server.listen(port, () => {
  logger.info(`Server running at port ${port} on ${process.env.NODE_ENV}`);
});

export default server;
