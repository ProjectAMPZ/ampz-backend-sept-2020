import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import morgan from 'morgan';
import logger from './config';
import './db';
import v1Router from './routes';

config();

const app = express();

const httpServer = require('http').createServer();
const io = require('socket.io')(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

io.on('connection', (socket) => {
  console.log('connected');
  socket.on('message', (data) => {
    console.log(data.message);
  });
});

httpServer.listen(2000, () => {
  console.log('app started on port 2000');
});

const port = process.env.PORT || 5000;
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

app.listen(port, () => {
  logger.info(`Server running at port ${port} on ${process.env.NODE_ENV}`);
});

export default app;
