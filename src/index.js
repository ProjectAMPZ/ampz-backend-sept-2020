import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import morgan from 'morgan';
import logger from './config';
import './db';
import v1Router from './routes';

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

app.use(morgan('combined', { stream: logger.stream }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get('/api/v1', (req, res) =>
  res.status(200).json({ status: 'success', message: 'Welcome to AMPZ API' })
);

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

const port = process.env.PORT || 5000;

io.on('connection', (socket) => {});

server.listen(port, () => {
  logger.info(`Server running at port ${port} in ${process.env.NODE_ENV} `);
});

export default server;
