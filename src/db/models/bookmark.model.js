import mongoose from 'mongoose';

const BookmarkSchema = new mongoose.Schema({
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

const Bookmark = mongoose.model('bookmark', BookmarkSchema);

export default Bookmark;
