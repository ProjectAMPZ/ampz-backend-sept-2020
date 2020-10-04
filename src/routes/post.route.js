import { Router } from 'express';
import PostController from '../controllers/post.controller';
import verifyToken from '../middlewares/auth.middleware';
import postFileUpload from '../services/postImageUpload.service';
import CommentValidator from '../validations/post/comment.validator';

const router = Router();

router.get('/', PostController.getPosts);
router.post('/', verifyToken, postFileUpload, PostController.createPost);
router.put('/:postId', verifyToken, postFileUpload, PostController.updatePost);
router.put('/like/:postId', verifyToken, PostController.likePost);
router.put('/bookmark/:postId', verifyToken, PostController.bookmarkPost);
router.put('/comment/:postId', verifyToken, CommentValidator.validateData(), CommentValidator.myValidationResult, PostController.commentOnPost);
export default router;
