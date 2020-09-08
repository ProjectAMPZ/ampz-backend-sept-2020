import mongoose, { Types } from "mongoose";

const AssociationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },

  institutionName: {
    type: String,
    required: true,
  },

  associationName: {
    type: String,
    required: true,
  },

  associationType: {
    type: String,
    required: true,
  },

  issueDate: {
    month: {
      type: String,
      required: true,
    },

    year: {
      type: Number,
      required: true,
    },
  },

  expiryDate: {
    month: {
      type: String,
      required: true,
    },

    year: {
      type: Number,
      required: true,
    },
  },

  active: {
    type: Boolean,
  },

  description: {
    type: String,
    required: true,
  },

  updateAt: {
    type: Date,
    default: Date.now,
  },
});

const Association = mongoose.model("association", AssociationSchema);

export default Association;
