import Like from '../db/models/like.model';
import Bookmark from '../db/models/bookmark.model';

export default {
  async likedByUser(postId, userId, res) {
    try {
      const condition = {
        postId,
        userId
      };
      const user = await Like.findOne(condition);
      return user;
    } catch (err) {
      return res.status(500).json({
        status: '500 Internal server error',
        error: 'Error checking for like',
      });
    }
  },
  async unLike(postId, userId, res) {
    try {
      const condition = {
        postId,
        userId
      };
      await Like.deleteMany(condition);
    } catch (err) {
      return res.status(500).json({
        status: '500 Internal server error',
        error: 'Error unliking post',
      });
    }
  },
  async like(postId, userId, res) {
    try {
      const condition = {
        postId,
        userId
      };
      await Like.create(condition);
    } catch (err) {
      return res.status(500).json({
        status: '500 Internal server error',
        error: 'Error liking post',
      });
    }
  },
  async bookmarkedByUser(postId, userId, res) {
    try {
      const condition = {
        postId,
        userId
      };
      const user = await Bookmark.findOne(condition);
      return user;
    } catch (err) {
      return res.status(500).json({
        status: '500 Internal server error',
        error: 'Error checking for bookamrk',
      });
    }
  },
  async removeBookmark(postId, userId, res) {
    try {
      const condition = {
        postId,
        userId
      };
      await Bookmark.deleteMany(condition);
    } catch (err) {
      return res.status(500).json({
        status: '500 Internal server error',
        error: 'Error removing bookmark',
      });
    }
  },
  async bookmark(postId, userId, res) {
    try {
      const condition = {
        postId,
        userId
      };
      await Bookmark.create(condition);
    } catch (err) {
      return res.status(500).json({
        status: '500 Internal server error',
        error: 'Error bookmarking post',
      });
    }
  },
};
