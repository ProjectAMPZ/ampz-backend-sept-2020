import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import morgan from 'morgan';
import logger from './config';
import './db';
import v1Router from './routes';
import Chat from './db/models/chatMessage.model';
import onlineUsers from './db/models/onlineUsers.model';

config();

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

global.logger = logger;
app.use(cors());

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

app.use(morgan('combined', { stream: logger.stream }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get('/api/v1', (req, res) =>
  res.status(200).json({ status: 'success', message: 'Welcome to AMPZ API' })
);
//mount router
app.use('/api/v1', v1Router);

app.use((req, res, next) => {
  const err = new Error('No endpoint found');
  err.status = 404;
  next(err);
});

app.use((err, req, res) => {
  res.status(err.status || 500).json({
    status: 'error',
    error: {
      message: err.message || 'Internal Server Error',
    },
  });
});

io.on('connection', (socket) => {
  // logger.log('connected')
  socket.on('chatMessage', (chatData) => {
    console.log(chatData);
    Chat.create(chatData, (err, res) => {
      if (err) throw err;
      socket.emit('newMessage', chatData);
    });

    onlineUsers.findOne({ name: chatData.to }, (err, res) => {
      //checks if the recipient of the message is online
      if (err) throw err;
      if (res != null)
        //if the recipient is found online, the message is emmitted to him/her
        socket.to(res.socketId).emit('newMessage', chatData);
    });
  });

  socket.on('usersDetails', (data) => {
    const onlineUser = {
      socketId: socket.id,
      name: data.from,
    };

    onlineUsers.create(onlineUser, (err, res) => {
      //inserts the logged in user to the collection of online users
      if (err) throw err;
      console.log(onlineUser.name + ' is online...');
    });

    Chat.find(
      {
        from: { $in: [data.from, data.to] },
        to: { $in: [data.from, data.to] },
      },
      { projection: { _id: 0 } },
      (err, res) => {
        if (err) throw err;
        else {
          socket.emit('outputMessage', res);
        }
      }
    );
  });

  socket.on('disconnect', () => {
    // logger.log('disconnected');
  });
});

const port = process.env.PORT || 5000;

server.listen(port, () => {
  logger.info(`Server running at port ${port} on ${process.env.NODE_ENV}`);
});

export default server;
