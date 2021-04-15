import { Router } from 'express';
import PostController from '../controllers/post.controller';
import verifyToken from '../middlewares/auth.middleware';
import postFileUpload from '../services/postImageUpload.service';
import CommentValidator from '../validations/post/comment.validator';
import singleFileDelete from '../services/imageDelete.service';

import ReportValidator from '../validations/post/report.validator';

const router = Router();

router.get('/', PostController.getPosts);
router.post('/', verifyToken, postFileUpload, PostController.createPost);
// router.put('/:postId', verifyToken, postFileUpload, PostController.updatePost);
router.put('/:postId', verifyToken, PostController.updatePost);
router.delete(
  '/:postId',
  verifyToken,
  singleFileDelete,
  PostController.deletePost
);
router.put('/like/:postId', verifyToken, PostController.likePost);
router.put('/bookmark/:postId', verifyToken, PostController.bookmarkPost);
router.get('/bookmarks', verifyToken, PostController.getBookmarks);

router.put('/application/:postId', verifyToken, PostController.applyForEvent);
router.put('/count/:postId', PostController.increaseCount);
router.put(
  '/report/:postId',
  verifyToken,
  ReportValidator.validateData(),
  ReportValidator.myValidationResult,
  PostController.reportPost
);
router.get('/:postId', PostController.getPost);
router.get('/tags/all', PostController.getPostsTags);
router.get('/user/posts/all', verifyToken, PostController.getUserPosts);

//comments
router.post(
  '/comment/:postId',
  verifyToken,
  CommentValidator.validateData(),
  CommentValidator.myValidationResult,
  PostController.commentOnPost
);
router.delete('/comment/:commentId', verifyToken, PostController.deleteComment);
router.put('/comment/:commentId', verifyToken, PostController.updateComment);

export default router;
