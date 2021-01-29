const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const notificationSchema = mongoose.Schema(
  {
    sentFrom: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    sentTo: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    type: {
      type: String,
      required: true,
      maxlength: 1000,
    },
    link: {
      type: String,
      required: true,
      maxlength: 1000,
    },
    seenStatus: {
      type: Boolean,
      required: false,
    },
  },
  { timestamps: true }
);

const Notification = mongoose.model("notification", notificationSchema);
module.exports = { Notification };
