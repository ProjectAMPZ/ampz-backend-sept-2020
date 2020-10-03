import mongoose from 'mongoose';

const FeatureSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'user',
  },
  sport: {
    type: String,
  },
  preferedArm: {
    type: String,
  },
  preferedFoot: {
    type: String,
  },
  position: {
    type: String,
  },
  height: {
    type: String,
  },
  weight: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Feature = mongoose.model('feature', FeatureSchema);

export default Feature;
