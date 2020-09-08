import mongoose, { mongo } from "mongoose";

const AchievementSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },

  title: {
    type: String,
    required: true,
    trim: true,
  },

  date: {
    day: {
      type: String,
      required: true,
    },
    month: {
      type: String,
      required: true,
    },

    year: {
      type: String,
      required: true,
    },
  },

  description: {
    type: String,
    required: true,
  },

  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Achievement = mongoose.model("achievement", AchievementSchema);

export default Achievement;
