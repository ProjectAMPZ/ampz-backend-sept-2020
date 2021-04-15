import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.Schema.ObjectId,
      ref: 'post',
    },
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: 'user',
    },
    text: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Comment = mongoose.model('comment', CommentSchema);

export default Comment;
