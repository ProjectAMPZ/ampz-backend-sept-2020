import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  gender: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: Number,
    required: true,
    unique: true,
  },
  dayOfBirth: {
    type: Number,
    required: true,
  },
  monthOfBirth: {
    type: String,
    required: true,
  },
  yearOfBirth: {
    type: Number,
    required: true,
  },
  userLocation: {
    type: String,
  },
  education: {
    type: String,
  },
  guardianName: {
    type: String,

  },
  guardianEmail: {
    type: String,
    required: true,
  },
  guardianPhone: {
    type: Number,
    required: true,
  },
  primarySport: {
    type: String,
    required: true,
  },
  academyName: {
    type: String,
    required: true,
  },
  yearEstablished: {
    type: Number,
    required: true,
  },
  biography: {
    type: String,
    required: true,
  },
  role: {
    type: String,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  isActivated: {
    type: Boolean,
    default: false,
  },
  coverPhotoUrl: {
    type: String,
  },
  profilePhotoUrl: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const User = mongoose.model('user', UserSchema);

export default User;
