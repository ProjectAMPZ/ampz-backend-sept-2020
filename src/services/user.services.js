import Follow from '../db/models/follow.model';

export default {
  async followedByUser(profileId, userId, res) {
    try {
      const condition = {
        userId,
        profileId,
      };
      const user = await Follow.findOne(condition);
      return user;
    } catch (err) {
      return res.status(500).json({
        status: '500 Internal server error',
        error: 'Error checking for Followers',
      });
    }
  },
  async unFollowUser(profileId, userId, res) {
    try {
      const condition = {
        userId,
        profileId,
      };
      await Follow.deleteMany(condition);
    } catch (err) {
      return res.status(500).json({
        status: '500 Internal server error',
        error: 'Error unfollowing user',
      });
    }
  },
  async followUser(profileId, userId, res) {
    try {
      const condition = {
        userId,
        profileId,
      };
      const result = await Follow.create(condition);
      return result;
    } catch (err) {
      return res.status(500).json({
        status: '500 Internal server error',
        error: 'Error following user',
      });
    }
  },
};
