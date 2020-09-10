import mongoose from "mongoose";

const ExperienceSchema = new mongoose.Schema({
  userId: {
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
  startMonth: {
    type: String,
    required: true,
  },
  startYear: {
    type: String,
    required: true,
  },
  endMonth: {
    type: String,
    required: true,
  },
  endYear: {
    type: String,
    required: true,
  },
  active: {
    type: Boolean,
  },
  keyAchievements: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Experience = mongoose.model("experience", ExperienceSchema);

export default Experience;
