import mongoose from 'mongoose';

const WatchlistSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'user',
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Watchlist = mongoose.model('watchlist', WatchlistSchema);

export default Watchlist;
