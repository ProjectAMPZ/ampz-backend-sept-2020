import mongoose from 'mongoose';

const BookmarkSchema = new mongoose.Schema(
  {
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
  },

  { timestamps: true }
);

const Bookmark = mongoose.model('bookmark', BookmarkSchema);

export default Bookmark;
