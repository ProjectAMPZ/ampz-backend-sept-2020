import mongoose from 'mongoose';

const AssociationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'user',
  },
  associationName: {
    type: String,
  },
  associationType: {
    type: String,
  },
  issueMonth: {
    type: Number,
  },
  issueYear: {
    type: Number,
  },
  expiryMonth: {
    type: Number,
  },
  expiryYear: {
    type: Number,
  },
  active: {
    type: Boolean,
  },
  description: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Association = mongoose.model('association', AssociationSchema);

export default Association;
