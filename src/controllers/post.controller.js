import Post from '../db/models/post.model';
import Application from '../db/models/application.model';
import Bookmark from '../db/models/bookmark.model';
import Comment from '../db/models/comment.model';
import Like from '../db/models/like.model';
import Report from '../db/models/report.model';
import logger from '../config';
import PostServices from '../services/post.services';
import Tag from '../db/models/tag.model';
import { path } from 'app-root-path';

/**
 *Contains Post Controller
 *
 * @class PostController
 */
class PostController {
  /* eslint camelcase: 0 */

  /**
   * create post.
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
      applicationLink,
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
        applicationLink,
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
        mediaType: req.body.mediaType,
        category: req.query.category,
      };
      post.tags = tags.split(/[\s,]+/).map((tag) => tag.trim());
      if (req.query.category === 'event') post.status = 'in-review';
      post = await Post.create(post);

      res.status(201).json({ status: 'success', data: post });
    } catch (err) {
      logger.error(err.message);
      res.status(500).json({ status: 'error', error: 'server error' });
    }
  }

  /**
   * get all tags with posts.
   * @param {Request} req - Response object.
   * @param {Response} res - The payload.
   * @memberof PostController
   * @returns {JSON} - A JSON success response.
   */
  static async getPostsTags(req, res) {
    try {
      const tags = await Tag.find();
      res
        .status(200)
        .json({ status: 'success', count: tags.length, data: tags });
    } catch (err) {
      // logger.error(err.message);
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
          populate: {
            path: 'userId',
            select:
              '_id fullName userName profilePhotoUrl yearOfBirth userLocation',
          },
        })
        .populate({ path: 'bookmark', select: '_id userId', model: Bookmark })
        .populate({ path: 'report', select: '_id userId', model: Report })
        .populate({
          path: 'comment',
          select: '_id userId text createdAt',
          model: Comment,
          populate: { path: 'userId', select: 'userName profilePhotoUrl' },
        })
        .populate({ path: 'like', select: '_id userId', model: Like })
        .sort({ createdAt: -1 });
      res
        .status(200)
        .json({ status: 'success', count: posts.length, data: posts });
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

  // TODO : update post cover photo seperately

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
          .json({ status: 'error', error: 'post not found' });
      }

      if (post.userId.toString() !== req.data.id) {
        console.log(req.data.id);
        return res.status(401).json({ status: 'error', error: 'unauthorized' });
      }
      await post.remove();
      res
        .status(204)
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
      const posts = await Post.findOne({ _id: postId })
        .populate({ path: 'userId', select: 'userName profilePhotoUrl' })
        .populate({
          path: 'application',
          select: '_id userId',
          model: Application,
        })
        .populate({ path: 'bookmark', select: '_id userId', model: Bookmark })
        .populate({ path: 'report', select: '_id userId', model: Report })
        .populate({
          path: 'comment',
          select: '_id userId text createdAt',
          model: Comment,
          populate: { path: 'userId', select: 'userName profilePhotoUrl' },
        })
        .populate({ path: 'like', select: '_id userId', model: Like });
      res.status(200).json({ status: 'success', data: posts });
    } catch (err) {
      res.status(500).json({ status: 'error', error: 'internal server error' });
    }
  }

  // /**
  //  * bookmark/unbookmark posts.
  //  * @param {Request} req - Response object.
  //  * @param {Response} res - The payload.
  //  * @memberof PostController
  //  * @returns {JSON} - A JSON success response.
  //  */
  // static async bookmarkPost(req, res) {
  //   try {
  //     const userId = req.data.id;
  //     const { postId } = req.params;

  //     const result = await PostServices.bookmarkedByUser(postId, userId, res);
  //     if (result) {
  //       await PostServices.removeBookmark(postId, userId, res);
  //     } else {
  //       await PostServices.bookmark(postId, userId, res);
  //     }
  //     const posts = await Post.findOne({ _id: postId })
  //       .populate({ path: 'userId', select: 'userName profilePhotoUrl' })
  //       .populate({
  //         path: 'application',
  //         select: '_id userId',
  //         model: Application,
  //       })
  //       .populate({ path: 'bookmark', select: '_id userId', model: Bookmark })
  //       .populate({ path: 'report', select: '_id userId', model: Report })
  //       .populate({
  //         path: 'comment',
  //         select: '_id userId text createdAt',
  //         model: Comment,
  //         populate: { path: 'userId', select: 'userName profilePhotoUrl' },
  //       })
  //       .populate({ path: 'like', select: '_id userId', model: Like });
  //     res.status(200).json({ status: 'success', data: posts });
  //   } catch (err) {
  //     res.status(500).json({ status: 'error', error: 'internal server error' });
  //   }
  // }

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

      const payload = {
        userId,
        postId,
      };

      const bookamrked = await Bookmark.findOne({
        $and: [{ postId: postId }, { userId: userId }],
      });
      if (bookamrked) {
        //remove bookmarked item
        await Bookmark.findOneAndRemove({
          $and: [{ postId: postId }, { userId: userId }],
        });

        return res
          .status(200)
          .json({ status: 'success', message: 'bookmark deleted' });
      }
      //bookmark the item
      await Bookmark.create(payload);

      res
        .status(200)
        .json({ status: 'success', message: 'post bookmarked successfully' });
    } catch (err) {
      logger.error(err.message);
      res.status(500).json({ status: 'error', error: 'server error' });
    }
  }

  /**
   * get a user's bookmarks.
   * @param {Request} req - Response object.
   * @param {Response} res - The payload.
   * @memberof PostController
   * @returns {JSON} - A JSON success response.
   */
  static async getBookmarks(req, res) {
    try {
      const bookmarks = await Bookmark.find({ userId: req.data.id }).populate({
        path: 'postId',
      });
      res
        .status(200)
        .json({ status: 'success', count: bookmarks.length, data: bookmarks });
    } catch (err) {
      logger.error(err.message);
      res.status(500).json({ status: 'error', error: 'server error' });
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
      await Comment.create({ ...request });
      const posts = await Post.findOne({ _id: postId })
        .populate({ path: 'userId', select: 'userName profilePhotoUrl' })
        .populate({
          path: 'application',
          select: '_id userId',
          model: Application,
        })
        .populate({ path: 'bookmark', select: '_id userId', model: Bookmark })
        .populate({ path: 'report', select: '_id userId', model: Report })
        .populate({
          path: 'comment',
          select: '_id userId text createdAt',
          model: Comment,
          populate: { path: 'userId', select: 'userName profilePhotoUrl' },
        })
        .populate({ path: 'like', select: '_id userId', model: Like });
      res.status(200).json({ status: 'success', data: posts });
    } catch (err) {
      res.status(500).json({ status: 'error', error: 'internal server error' });
    }
  }

  /**
   * delete a comment.
   * @param {Request} req - Response object.
   * @param {Response} res - The payload.
   * @memberof PostController
   * @returns {JSON} - A JSON success response.
   */
  static async deleteComment(req, res) {
    const { commentId } = req.params;

    try {
      await Comment.findOneAndRemove({ _id: commentId });
      //update to check for the user deleting the comment
      res
        .status(204)
        .json({ status: 'success', message: 'comment deleted successfully' });
    } catch (err) {
      res.status(500).json({ status: 'error', error: 'server error' });
    }
  }

  /**
   * update a comment.
   * @param {Request} req - Response object.
   * @param {Response} res - The payload.
   * @memberof PostController
   * @returns {JSON} - A JSON success response.
   */
  static async updateComment(req, res) {
    const { commentId } = req.params;

    try {
      const comment = await Comment.findOneAndUpdate(
        { _id: commentId },
        req.body,
        {
          new: true,
        }
      );
      res.status(200).json({ status: 'success', data: comment });
    } catch (err) {
      console.log(err.message);
      res.status(500).json({ status: 'error', error: 'server error' });
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
      const posts = await Post.findOne({ _id: postId })
        .populate({ path: 'userId', select: 'userName profilePhotoUrl' })
        .populate({
          path: 'application',
          select: '_id userId',
          model: Application,
        })
        .populate({ path: 'bookmark', select: '_id userId', model: Bookmark })
        .populate({ path: 'report', select: '_id userId', model: Report })
        .populate({
          path: 'comment',
          select: '_id userId text createdAt',
          model: Comment,
          populate: { path: 'userId', select: 'userName profilePhotoUrl' },
        })
        .populate({ path: 'like', select: '_id userId', model: Like });
      res.status(200).json({ status: 'success', data: posts });
    } catch (err) {
      res.status(500).json({ status: 'error', error: 'internal server error' });
    }
  }

  /**
   * increase share count.
   * @param {Request} req - Response object.
   * @param {Response} res - The payload.
   * @memberof PostController
   * @returns {JSON} - A JSON success response.
   */
  static async increaseCount(req, res) {
    try {
      const action = req.body.action;
      const { postId } = req.params;
      let post = await Post.findById(postId);
      let data = {};
      if (action === 'share') {
        data = {
          share: Number(post.share) + 1,
        };
      } else {
        data = {
          views: Number(post.views) + 1,
        };
      }

      post = await Post.findOneAndUpdate({ _id: postId }, data)
        .populate({ path: 'userId', select: 'userName profilePhotoUrl' })
        .populate({
          path: 'application',
          select: '_id userId',
          model: Application,
        })
        .populate({ path: 'bookmark', select: '_id userId', model: Bookmark })
        .populate({ path: 'report', select: '_id userId', model: Report })
        .populate({
          path: 'comment',
          select: '_id userId text createdAt',
          model: Comment,
          populate: { path: 'userId', select: 'userName profilePhotoUrl' },
        })
        .populate({ path: 'like', select: '_id userId', model: Like });
      res.status(200).json({
        status: 'success',
        data: post,
        message: 'count increased successfully',
      });
    } catch (err) {
      logger.error(err.message);
      res.status(500).json({ status: 'error', error: 'internal server error' });
    }
  }

  /**
   * report post.
   * @param {Request} req - Response object.
   * @param {Response} res - The payload.
   * @memberof PostController
   * @returns {JSON} - A JSON success response.
   */
  static async reportPost(req, res) {
    try {
      const userId = req.data.id;
      const { postId } = req.params;
      const { text } = req.body;
      const request = {
        postId,
        userId,
        text,
      };
      await Report.create({ ...request });

      const posts = await Post.findOne({ _id: postId })
        .populate({ path: 'userId', select: 'userName profilePhotoUrl' })
        .populate({
          path: 'application',
          select: '_id userId',
          model: Application,
        })
        .populate({ path: 'bookmark', select: '_id userId', model: Bookmark })
        .populate({ path: 'report', select: '_id userId', model: Report })
        .populate({
          path: 'comment',
          select: '_id userId text createdAt',
          model: Comment,
          populate: { path: 'userId', select: 'userName profilePhotoUrl' },
        })
        .populate({ path: 'like', select: '_id userId', model: Like });
      res.status(200).json({ status: 'success', data: posts });
    } catch (err) {
      res.status(500).json({ status: 'error', error: 'internal server error' });
    }
  }

  /**
   * get single post.
   * @param {Request} req - Response object.
   * @param {Response} res - The payload.
   * @memberof PostController
   * @returns {JSON} - A JSON success response.
   */
  static async getPost(req, res) {
    try {
      const { postId } = req.params;
      const posts = await Post.findOne({ _id: postId })
        .populate({ path: 'userId', select: 'userName profilePhotoUrl' })
        .populate({
          path: 'application',
          select: '_id userId',
          model: Application,
        })
        .populate({ path: 'bookmark', select: '_id userId', model: Bookmark })
        .populate({ path: 'report', select: '_id userId', model: Report })
        .populate({
          path: 'comment',
          select: '_id userId text createdAt',
          model: Comment,
          populate: { path: 'userId', select: 'userName profilePhotoUrl' },
        })
        .populate({ path: 'like', select: '_id userId', model: Like })
        .sort({ createdAt: -1 });
      res.status(200).json({ status: 'success', data: posts });
    } catch (err) {
      // logger.error(err.message);
      res.status(500).json({ status: 'error', error: 'server error' });
    }
  }

  /**
   * get a user post.
   * @param {Request} req - Response object.
   * @param {Response} res - The payload.
   * @memberof PostController
   * @returns {JSON} - A JSON success response.
   */
  static async getUserPosts(req, res) {
    try {
      const posts = await Post.find({ userId: req.data.id });
      res
        .status(200)
        .json({ status: 'success', count: posts.length, data: posts });
    } catch (err) {
      logger.error(err.message);
      res.status(500).json({ status: 'error', error: 'server error' });
    }
  }
}
export default PostController;
