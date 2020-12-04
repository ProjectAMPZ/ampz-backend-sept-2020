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
    type: String,
  },
  issueYear: {
    type: String,
  },
  expiryMonth: {
    type: String,
  },
  expiryYear: {
    type: String,
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
