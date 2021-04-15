const mongoose = require('mongoose');

const groupChatSchema = new mongoose.Schema(
  {
    participants: [mongoose.Schema.ObjectId],
  },
  { timestamps: true }
);

const GroupChat = mongoose.model('groupchat', groupChatSchema);
module.exports = GroupChat;
