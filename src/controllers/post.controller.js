import Post from '../db/models/post.model';
import Application from '../db/models/application.model';
import Bookmark from '../db/models/bookmark.model';
import Comment from '../db/models/comment.model';
import Like from '../db/models/like.model';
import logger from '../config';

/**
 *Contains Post Controller
 *
 * @class PostController
 */
class PostController {
  /* eslint camelcase: 0 */

  /**
   * get all posts.
   * @param {Request} req - Response object.
   * @param {Response} res - The payload.
   * @memberof PostController
   * @returns {JSON} - A JSON success response.
   */
  static async getPosts(req, res) {
    try {
      const posts = await Post.find().populate({ path: 'userId', select: 'userName profilePhotoUrl' }).populate({ path: 'application', select: '_id userId', model: Application }).populate({ path: 'bookmark', select: '_id userId', model: Bookmark })
        .populate({ path: 'comment', select: '_id userId text', model: Comment })
        .populate({ path: 'like', select: '_id userId', model: Like });
      res.status(200)
        .json({ status: 'success', data: posts });
    } catch (err) {
      // logger.error(err.message);
      res.status(500).json({ status: 'error', error: 'server error' });
    }
  }
}

export default PostController;