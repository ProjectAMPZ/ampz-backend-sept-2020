import mongoose from 'mongoose';

const LineupSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'user',
  },
  name: {
    type: String,
  },

  description: {
    type: String,
  },

  mediaUrl: {
    type: String,
  },
  mediaType: {
    type: String,
  },
});

const Lineup = mongoose.model('lineup', LineupSchema);

export default Lineup;
