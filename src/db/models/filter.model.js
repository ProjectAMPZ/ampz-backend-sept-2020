import mongoose from 'mongoose';

const FilterSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'user',
  },

  filterName: {
    type: String,
  },

  gender: {
    type: String,
  },

  sport: {
    type: String,
  },

  position: {
    type: String,
  },

  eductation: {
    type: String,
  },

  skillRating: {
    type: String,
  },

  location: {
    type: String,
  },

  age: {
    type: String,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Filter = mongoose.model('filter', FilterSchema);

export default Filter;
