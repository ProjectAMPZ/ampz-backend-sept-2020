import mongoose from 'mongoose';

const ExperienceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'user',
  },
  teamName: {
    type: String,
  },
  competitionType: {
    type: String,
  },
  startMonth: {
    type: String,
  },
  startYear: {
    type: String,
  },
  endMonth: {
    type: String,
  },
  endYear: {
    type: String,
  },
  active: {
    type: Boolean,
  },
  keyAchievements: {
    type: String,
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

const Experience = mongoose.model('experience', ExperienceSchema);

export default Experience;
