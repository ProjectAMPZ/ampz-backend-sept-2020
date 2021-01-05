import FollowServices from '../services/user.services';
import Feature from '../db/models/feature.model';
import Experience from '../db/models/experience.model';
import Association from '../db/models/association.model';
import Achievement from '../db/models/achievement.model';
import Post from '../db/models/post.model';
import Application from '../db/models/application.model';
import Follow from '../db/models/follow.model';
import AuthServices from '../services/auth.services';
import Auth from '../db/models/users.model';
import User from '../db/models/users.model';
import Comment from '../db/models/comment.model';
import Like from '../db/models/like.model';
/**
 *Contains User Controller
 *
 * @class UserController
 */
class UserController {
  /* eslint camelcase: 0 */

  /**
   * follow/unfollow a user.
   * @param {Request} req - Response object.
   * @param {Response} res - The payload.
   * @memberof PostController
   * @returns {JSON} - A JSON success response.
   */
  static async followUser(req, res) {
    try {
      let result1 = '';
      const userId = req.data.id;
      const { profileId } = req.params;

      const result = await FollowServices.followedByUser(
        profileId,
        userId,
        res
      );
      if (result) {
        result1 = await FollowServices.unFollowUser(profileId, userId, res);
      } else {
        result1 = await FollowServices.followUser(profileId, userId, res);
      }
      res.status(200).json({ status: 'success', data: result1 });
    } catch (err) {
      res.status(500).json({ status: 'error', error: 'internal server error' });
    }
  }

  /**
   * get user.
   * @param {Request} req - Response object.
   * @param {Response} res - The payload.
   * @memberof UserController
   * @returns {JSON} - A JSON success response.
   */
  static async getUser(req, res) {
    try {
      const user = await AuthServices.userIdExist(req.params.profileId, res);
      if (user.length) {
        const condition = {
          userId: user[0].id,
        };
        const feature = await Feature.findOne(condition);
        const experience = await Experience.find(condition);
        const association = await Association.find(condition);
        const follow = await Follow.find(condition);
        const achievement = await Achievement.find(condition);
        const post = await Post.find(condition).populate({
          path: 'application',
          model: Application,
          populate: {
            path: 'userId',
            select: '_id userName profilePhotoUrl yearOfBirth userLocation',
          },
        });

        return res.status(200).json({
          status: 'success',
          data: {
            user: {
              ...user[0]._doc,
            },
            feature,
            experience,
            association,
            achievement,
            post,
            follow,
          },
        });
      }
      return res.status(404).json({
        status: 'error',
        error: 'User not found',
      });
    } catch (err) {
      return res.status(500).json({
        status: '500 Internal server error',
        error: 'Error Logging in user',
      });
    }
  }

  /**
   * Get all users.
   * @param {Request} req - Response object.
   * @param {Response} res - The payload.
   * @memberof AuthController
   * @returns {JSON} - A JSON success response.
   */
  static async getUsers(req, res) {
    try {
      const users = await Auth.find();
      res.status(200).json({
        status: 'success',
        count: users.length,
        data: users,
      });
    } catch (err) {
      logger.error(err.message);
      res.status(500).json({ status: 'error', error: 'Server error' });
    }
  }

  // /**
  //  * delete a user.
  //  * @param {Request} req - Response object.
  //  * @param {Response} res - The payload.
  //  * @memberof AuthController
  //  * @returns {JSON} - A JSON success response.
  //  */
  // static async deleteUser(req, res) {
  //   try {
  //     await User.findByIdAndRemove(req.params.userId);
  //     await Post.deleteMany({ userId: req.params.userId });
  //     await Association.findOneAndRemove({ userId: req.params.userId });
  //     await Experience.findOneAndRemove({ userId: req.params.userId });
  //     await Feature.findOneAndRemove({ userId: req.params.userId });
  //     await Comment.deleteMany({ userId: req.params.userId });
  //     await Like.deleteMany({ userId: req.params.userId });

  //     res.status(200).json({
  //       status: 'success',
  //       message: 'account deleted',
  //     });
  //   } catch (err) {
  //     logger.error(err.message);
  //     res.status(500).json({ status: 'error', error: 'Server error' });
  //   }
  // }
}

export default UserController;
