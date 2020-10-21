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
  status: {
    type: String,
    default: 'pending',
  },
  mediaType: {
    type: String,
  },
});

const Lineup = mongoose.model('lineup', LineupSchema);

export default Lineup;
