import mongoose from "mongoose";

const ExperienceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },

  teamName: {
    type: String,
    required: true,
  },

  competitionType: {
    type: String,
    required: true,
  },

  startDate: {
    month: {
      type: Number,
      required: true,
    },

    year: {
      type: Number,
      required: true,
    },
  },

  endDate: {
    month: {
      type: Number,
      required: true,
    },

    year: {
      type: Number,
      required: true,
    },
  },

  active: {
    type: Boolean,
  },

  keyAchievements: {
    type: String,
    required: true,
  },

  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Experience = mongoose.model("experience", ExperienceSchema);

export default Experience;
