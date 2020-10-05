import Post from '../db/models/post.model';
import Application from '../db/models/application.model';
import Bookmark from '../db/models/bookmark.model';
import Comment from '../db/models/comment.model';
import Like from '../db/models/like.model';
import logger from '../config';
import PostServices from '../services/post.services';

/**
 *Contains Post Controller
 *
 * @class PostController
 */
class PostController {
  /* eslint camelcase: 0 */

  /**
   * create post.
   * create a post.
   * @param {Request} req - Response object.
   * @param {Response} res - The payload.
   * @memberof PostController
   * @returns {JSON} - A JSON success response.
   */
  static async createPost(req, res) {
    const {
      caption,
      description,
      tags,
      eventType,
      sport,
      minAge,
      maxAge,
      country,
      state,
      venue,
      startDate,
      endDate,
      startTime,
      endTime,
      deadline,
      fee,
    } = req.body;
    try {
      let post = {
        userId: req.data.id,
        caption,
        description,
        tags,
        eventType,
        sport,
        minAge,
        maxAge,
        country,
        state,
        venue,
        startDate,
        endDate,
        startTime,
        endTime,
        deadline,
        fee,
        mediaUrl: req.body.mediaUrl,
        category: req.query.category,
      };
      if (tags) post.tags = tags.split(',').map((tag) => tag.trim());
      post = await Post.create(post);
      res.status(201).json({ status: 'success', data: post });
    } catch (err) {
      logger.error(err.message);
      res.status(500).json({ status: 'error', error: 'server error' });
    }
  }

  /**
   * get all posts.
   * @param {Request} req - Response object.
   * @param {Response} res - The payload.
   * @memberof PostController
   * @returns {JSON} - A JSON success response.
   */
  static async getPosts(req, res) {
    try {
      const posts = await Post.find()
        .populate({ path: 'userId', select: 'userName profilePhotoUrl' })
        .populate({
          path: 'application',
          select: '_id userId',
          model: Application,
        })
        .populate({ path: 'bookmark', select: '_id userId', model: Bookmark })
        .populate({
          path: 'comment',
          select: '_id userId text',
          model: Comment,
        })
        .populate({ path: 'like', select: '_id userId', model: Like });
      res.status(200).json({ status: 'success', data: posts });
    } catch (err) {
      // logger.error(err.message);
      res.status(500).json({ status: 'error', error: 'server error' });
    }
  }

  /**
   * update post.
   * @param {Request} req - Response object.
   * @param {Response} res - The payload.
   * @memberof postController
   * @returns {JSON} - A JSON success response.
   */
  static async updatePost(req, res) {
    try {
      const post = await Post.findOneAndUpdate(
        { _id: req.params.postId },
        req.body,
        {
          new: true,
        }
      );

      res.status(200).json({ status: 'success', data: post });
    } catch (err) {
      logger.error(err.message);
      res.status(500).json({
        status: 'error',
        error: 'Server error',
      });
    }
  }

  /**
   * delete a post.
   * @param {Request} req - Response object.
   * @param {Response} res - The payload.
   * @memberof PostController
   * @returns {JSON} - A JSON success response.
   */
  static async deletePost(req, res) {
    try {
      const post = await Post.findById({ _id: req.params.postId });
      if (!post) {
        return res
          .status(404)
          .json({ status: '404 Not Found', error: 'post not found' });
      }

      await post.remove();
      return res
        .status(200)
        .json({ status: 'success', message: 'post deleted successfully' });
    } catch (err) {
      logger.error(err.message);
      res.status(500).json({ status: 'error', error: 'server error' });
    }
  }

  /**
   * like/unlike posts.
   * @param {Request} req - Response object.
   * @param {Response} res - The payload.
   * @memberof PostController
   * @returns {JSON} - A JSON success response.
   */
  static async likePost(req, res) {
    try {
      const userId = req.data.id;
      const { postId } = req.params;

      const result = await PostServices.likedByUser(postId, userId, res);
      if (result) {
        await PostServices.unLike(postId, userId, res);
      } else {
        await PostServices.like(postId, userId, res);
      }
      res
        .status(200)
        .json({ status: 'success', message: 'Post like updated successfully' });
    } catch (err) {
      res.status(500).json({ status: 'error', error: 'internal server error' });
    }
  }

  /**
   * bookmark/unbookmark posts.
   * @param {Request} req - Response object.
   * @param {Response} res - The payload.
   * @memberof PostController
   * @returns {JSON} - A JSON success response.
   */
  static async bookmarkPost(req, res) {
    try {
      const userId = req.data.id;
      const { postId } = req.params;

      const result = await PostServices.bookmarkedByUser(postId, userId, res);
      if (result) {
        await PostServices.removeBookmark(postId, userId, res);
      } else {
        await PostServices.bookmark(postId, userId, res);
      }
      res
        .status(200)
        .json({ status: 'success', message: 'Bookmark updated successfully' });
    } catch (err) {
      res.status(500).json({ status: 'error', error: 'internal server error' });
    }
  }

  /**
   * comment on post.
   * @param {Request} req - Response object.
   * @param {Response} res - The payload.
   * @memberof PostController
   * @returns {JSON} - A JSON success response.
   */
  static async commentOnPost(req, res) {
    try {
      const userId = req.data.id;
      const { postId } = req.params;
      const { text } = req.body;
      const request = {
        postId,
        userId,
        text,
      };
      Comment.create({ ...request });
      res
        .status(200)
        .json({ status: 'success', message: 'Comment added successfully' });
    } catch (err) {
      res.status(500).json({ status: 'error', error: 'internal server error' });
    }
  }

    /**
   * apply for event.
   * @param {Request} req - Response object.
   * @param {Response} res - The payload.
   * @memberof PostController
   * @returns {JSON} - A JSON success response.
   */
  static async applyForEvent(req, res) {
    try {
      const userId = req.data.id;
      const { postId } = req.params;

      const result = await PostServices.appliedForByUser(postId, userId, res);
      if (result) {
        await PostServices.removeApplication(postId, userId, res);
      } else {
        await PostServices.makeApplication(postId, userId, res);
      }
      res
        .status(200)
        .json({ status: 'success', message: 'Application updated successfully' });
    } catch (err) {
      res.status(500).json({ status: 'error', error: 'internal server error' });
    }
  }
}

export default PostController;
