import mongoose from 'mongoose';

const AchievementSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'user',
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  month: {
    type: Number,
    required: true,
  },

  year: {
    type: Number,
    required: true,
  },
  description: {
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

const Achievement = mongoose.model('achievement', AchievementSchema);

export default Achievement;
