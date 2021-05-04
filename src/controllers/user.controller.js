import Feature from '../db/models/feature.model';
import Experience from '../db/models/experience.model';
import Association from '../db/models/association.model';
import Achievement from '../db/models/achievement.model';
import Post from '../db/models/post.model';
import Application from '../db/models/application.model';
import Follow from '../db/models/follow.model';
import AuthServices from '../services/auth.services';
import Auth from '../db/models/user.model';
import Lineup from '../db/models/lineup.model';
import logger from '../config';

/**
 *Contains User Controller
 *
 * @class UserController
 */
class UserController {
  /* eslint camelcase: 0 */

  /**
   * follow user.
   * @param {Request} req - Response object.
   * @param {Response} res - The payload.
   * @memberof PostController
   * @returns {JSON} - A JSON success response.
   */
  static async followUser(req, res) {
    const { userId } = req.params;
    const profileId = req.data.id;
    try {
      const follower = new Follow({
        userId,
        profileId,
      });

      let followers = await Follow.find({ userId });

      const following = followers.find(
        (follower) => follower.profileId.toString() === req.data.id
      );

      if (following) {
        // are these operations of  not expensive?
        await Follow.deleteOne({ userId, profileId });
        followers = await Follow.find({ userId });
        return res.status(200).json({
          status: 'success',
          count: followers.length,
          data: followers,
        });
      }

      await follower.save();

      followers = await Follow.find({ userId });

      res
        .status(200)
        .json({ status: 'success', count: followers.length, data: followers });
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
        const following = await Follow.find({ profileId: user[0].id });
        const achievement = await Achievement.find(condition);
        const lineup = await Lineup.find(condition);
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
          message: 'user found',
          data: {
            user: {
              ...user[0]._doc,
            },
            feature,
            experience,
            association,
            achievement,
            lineup,
            post,
            follow,
            following,
          },
        });
      }
      return res.status(404).json({
        status: 'error',
        error: 'User not found',
      });
    } catch (err) {
      console.log(err.message);
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
      const users = await Auth.find()
        .populate({ path: 'followers', model: Follow })
        .populate({ path: 'following', model: Follow });

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
