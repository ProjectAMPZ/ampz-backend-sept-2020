import mongoose from 'mongoose';

const AchievementSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'user',
  },

  title: {
    type: String,
  },

  day: {
    type: String,
  },
  month: {
    type: String,
  },

  year: {
    type: String,
  },
  description: {
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

const Achievement = mongoose.model('achievement', AchievementSchema);

export default Achievement;
