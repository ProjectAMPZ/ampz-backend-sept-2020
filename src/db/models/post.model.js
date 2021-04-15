import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: 'user',
    },
    caption: {
      type: String,
    },

    description: {
      type: String,
    },

    tags: [String],

    mediaUrl: {
      type: String,
    },
    mediaType: {
      type: String,
    },

    category: {
      type: String,
    },

    eventType: {
      type: String,
    },

    applicationLink: {
      type: String,
    },

    minAge: {
      type: String,
    },

    maxAge: {
      type: String,
    },

    country: {
      type: String,
    },

    state: {
      type: String,
    },

    venue: {
      type: String,
    },

    startDate: {
      type: String,
    },

    endDate: {
      type: String,
    },

    startTime: {
      type: String,
    },

    endTime: {
      type: String,
    },

    deadline: {
      type: String,
    },

    fee: {
      type: String,
    },

    views: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
    },

    share: {
      type: Number,
      default: 0,
    },
    date: {
      type: Number,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },

    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },

  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

PostSchema.virtual('application', {
  ref: 'application',
  localField: '_id',
  foreignField: 'postId',
  justOne: false,
});

PostSchema.virtual('bookmark', {
  ref: 'bookmark',
  localField: '_id',
  foreignField: 'postId',
  justOne: false,
});

PostSchema.virtual('like', {
  ref: 'like',
  localField: '_id',
  foreignField: 'postId',
  justOne: false,
});

PostSchema.virtual('comment', {
  ref: 'comment',
  localField: '_id',
  foreignField: 'postId',
  justOne: false,
});

PostSchema.virtual('report', {
  ref: 'report',
  localField: '_id',
  foreignField: 'postId',
  justOne: false,
});

PostSchema.pre('save', function (next) {
  this.dateOfBirth = `${this.dayOfBirth} - ${this.monthOfBirth} - ${this.yearOfBirth}`;
  next();
});

const Post = mongoose.model('post', PostSchema);

export default Post;
