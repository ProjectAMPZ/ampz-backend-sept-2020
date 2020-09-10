import mongoose from "mongoose";

const AssociationSchema = new mongoose.Schema({
  userId: {
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
  issueMonth: {
    type: String,
    required: true,
  },
  issueYear: {
    type: Number,
    required: true,
  },
  expiryMonth: {
    type: String,
    required: true,
  },
  expiryYear: {
    type: Number,
    required: true,
  },
  active: {
    type: Boolean,
  },
  description: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updateAt: {
    type: Date,
    default: Date.now,
  },
});


const Association = mongoose.model("association", AssociationSchema);

export default Association;
