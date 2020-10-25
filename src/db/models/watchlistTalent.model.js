import mongoose from 'mongoose';

const WatchlistTalentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'user',
  },
  watchlistId: {
    type: mongoose.Schema.ObjectId,
    ref: 'watchlist',
  },
});

const WatchlistTalent = mongoose.model(
  'watchlisttalent',
  WatchlistTalentSchema
);

export default WatchlistTalent;
