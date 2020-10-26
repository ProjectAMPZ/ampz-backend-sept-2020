import mongoose from 'mongoose';

const FollowSchema = new mongoose.Schema({  
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'user',
  },
  profileId: {
    type: mongoose.Schema.ObjectId,
    ref: 'user',
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
});

const Follow = mongoose.model('follow', FollowSchema);

export default Follow;
