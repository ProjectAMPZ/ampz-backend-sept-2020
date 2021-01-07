const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema(
  {
    from: {
      type: String,
    },

    to: {
      type: String,
    },
    message: {
      type: String,
    },

    mediaUrl: {
      type: String,
    },
  },
  { timestamps: true }
);

const ChatMessage = mongoose.model('chatmessage', chatMessageSchema);
module.exports = ChatMessage;
