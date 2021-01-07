const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.ObjectId,
    },

    from: {
      userName: {
        type: String,
      },
      fullName: {
        type: String,
      },

      role: {
        type: String,
      },

      profilePhotoUrl: {
        type: String,
      },
    },

    to: {
      userName: {
        type: String,
      },
      fullName: {
        type: String,
      },

      role: {
        type: String,
      },

      profilePhotoUrl: {
        type: String,
      },
    },
    // message: {
    //   type: String,
    // },

    // type: {
    //   type: String,
    // },
  },
  { timestamps: true }
);

const Chat = mongoose.model('chat', chatSchema);
module.exports = Chat;
