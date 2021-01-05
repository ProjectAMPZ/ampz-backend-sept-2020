import { socketServer } from '../index';

const io = require('socket.io')(socketServer, {
  // ...
});

io.on('connection', (socket) => {
  console.log('connected');
  socket.on('message', (data) => {
    console.log(data.message);
  });
});
