import mongoose from 'mongoose';

const LikeSchema = new mongoose.Schema({
  postId: {
    type: mongoose.Schema.ObjectId,
    ref: 'post',
  },
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'user',
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

const Like = mongoose.model('like', LikeSchema);

export default Like;
