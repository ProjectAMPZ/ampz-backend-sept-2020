import { Router } from 'express';
import PostController from '../controllers/post.controller';
import verifyToken from '../middlewares/auth.middleware';
import postFileUpload from '../services/postImageUpload.service';
import CommentValidator from '../validations/post/comment.validator';
import singleFileDelete from '../services/imageDelete.service';

import CountValidator from '../validations/post/count.validator';
import ReportValidator from '../validations/post/report.validator';

const router = Router();

router.get('/', PostController.getPosts);
router.post('/', verifyToken, postFileUpload, PostController.createPost);
router.put('/:postId', verifyToken, postFileUpload, PostController.updatePost);
router.delete(
  '/:postId',
  verifyToken,
  singleFileDelete,
  PostController.deletePost
);
router.put('/like/:postId', verifyToken, PostController.likePost);
router.put('/bookmark/:postId', verifyToken, PostController.bookmarkPost);
router.put(
  '/comment/:postId',
  verifyToken,
  CommentValidator.validateData(),
  CommentValidator.myValidationResult,
  PostController.commentOnPost
);
router.put('/application/:postId', verifyToken, PostController.applyForEvent);
router.put(
  '/count/:postId',
  verifyToken,
  CountValidator.validateData(),
  CountValidator.myValidationResult,
  PostController.increaseCount
);
router.put(
  '/report/:postId',
  verifyToken,
  ReportValidator.validateData(),
  ReportValidator.myValidationResult,
  PostController.reportPost
);
router.get('/:postId', PostController.getPost);

export default router;
