import mongoose, { mongo } from "mongoose";

const FeatureSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },

  sport: {
    type: String,
    required: true,
  },

  preferedArm: {
    type: String,
    required: true,
  },

  preferedFoot: {
    type: String,
    required: true,
  },

  position: {
    type: String,
    required: true,
  },
  height: {
    type: String,
    required: true,
  },

  weight: {
    type: String,
    required: true,
  },

  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Feature = mongoose.model("features", FeatureSchema);

export default Feature;
