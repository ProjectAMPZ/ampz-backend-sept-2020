import mongoose from 'mongoose';

const ApplicationSchema = new mongoose.Schema({
  postId: {
    type: mongoose.Schema.ObjectId,
    ref: 'post',
  },
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'user',
  },
  status: {
    type: String,
    default: 'pending',
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

const Application = mongoose.model('application', ApplicationSchema);

export default Application;
