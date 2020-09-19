import mongoose from 'mongoose';

const FeatureSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
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
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Feature = mongoose.model('features', FeatureSchema);

export default Feature;
