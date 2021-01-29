const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    users: [
      {
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
    ],
    userId: {
      type: mongoose.Schema.ObjectId,
    },
    // message: {
    //   type: String,
    // },
    // sender: {
    //   type: mongoose.Schema.ObjectId,
    //   ref: "user",
    // },
    // type: {
    //   type: String,
    // },
  },
  { timestamps: true }
);

const Message = mongoose.model("message", messageSchema);
module.exports = Message;
