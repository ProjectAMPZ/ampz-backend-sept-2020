import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'user',
  },
  skills: [
    {
      name: {
        type: String,
      },

      ratings: [
        {
          by: {
            type: mongoose.Schema.ObjectId,
            ref: 'user',
          },
          rating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
          },
        },
      ],

      averageRating: {
        type: Number,
      },
    },
  ],
});

const Skill = mongoose.model('skill', skillSchema);

export default Skill;
