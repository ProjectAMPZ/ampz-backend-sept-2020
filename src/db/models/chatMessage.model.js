const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema(
  {
    groupchatId: {
      type: mongoose.Schema.ObjectId,
      ref: 'groupchat',
    },
    from: {
      type: mongoose.Schema.ObjectId,
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
