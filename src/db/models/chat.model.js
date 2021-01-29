const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema(
  {
    users: [
      {
        userName: {
          type: String,
        },
        fullName: {
          type: String,
        },

        role: {
          type: String,
        },
        userId: {
          type: mongoose.Schema.ObjectId,
        },
        profilePhotoUrl: {
          type: String,
        },
      },
    ],
    message: {
      type: String,
    },
    sender: {
      type: mongoose.Schema.ObjectId,
      ref: 'user',
    },
    type: {
      type: String,
    },
  },
  { timestamps: true }
);

const Chat = mongoose.model('Chat', chatSchema);
module.exports = Chat;
