import mongoose from 'mongoose';

const ReportSchema = new mongoose.Schema({
  postId: {
    type: mongoose.Schema.ObjectId,
    ref: 'post',
  },
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'user',
  },
  text: {
    type: String,
    required: true,
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

const Report = mongoose.model('report', ReportSchema);

export default Report;
