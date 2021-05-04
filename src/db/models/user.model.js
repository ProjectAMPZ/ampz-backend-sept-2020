import mongoose from 'mongoose';
import brcypt from 'bcryptjs';

const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
    },

    googleUserId: {
      type: String,
    },
    password: {
      type: String,
      select: false,
    },
    email: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
    },
    country: {
      type: String,
    },
    phoneNumber: {
      type: String,
    },
    dayOfBirth: {
      type: Number,
    },
    monthOfBirth: {
      type: Number,
    },
    yearOfBirth: {
      type: Number,
    },
    birthDate: {
      type: String,
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
    },
    club: {
      type: String,
    },
    international: {
      type: String,
    },
    guardianPhone: {
      type: String,
    },
    primarySport: {
      type: String,
    },
    academyName: {
      type: String,
    },
    yearEstablished: {
      type: Number,
    },
    biography: {
      type: String,
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

    // role: {
    //   type: String,
    //   enum: ['talent', 'scout', 'coach', 'academy', 'fan'],
    // },

    coverPhotoUrl: {
      type: String,
    },
    profilePhotoUrl: {
      type: String,
    },
  },

  { timestamps: true },

  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

UserSchema.virtual('feature', {
  ref: 'feature',
  localField: '_id',
  foreignField: 'userId',
  justOne: true,
});

UserSchema.virtual('followers', {
  ref: 'follow',
  localField: '_id',
  foreignField: 'userId',
  justOne: false,
});

UserSchema.virtual('following', {
  ref: 'follow',
  localField: '_id',
  foreignField: 'profileId',
  justOne: false,
});

UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await brcypt.compare(enteredPassword, this.password);
};

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await brcypt.genSalt(10);
  this.password = await brcypt.hash(this.password, salt);
});

const User = mongoose.model('user', UserSchema);

export default User;
