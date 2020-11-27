import mongoose from 'mongoose';

const TagSchema = new mongoose.Schema({
  postId: [{ type: mongoose.Schema.ObjectId }],
  tagName: {
    type: String,
  },
  count: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Tag = mongoose.model('tag', TagSchema);

export default Tag;
