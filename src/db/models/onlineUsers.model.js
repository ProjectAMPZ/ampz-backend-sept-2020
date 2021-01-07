const mongoose = require('mongoose');

const onlineUsersSchema = new mongoose.Schema({
  socketId: {
    type: String,
  },
  name: {
    type: String,
  },
});

const onlineUsers = mongoose.model('onlineusers', onlineUsersSchema);
module.exports = onlineUsers;
