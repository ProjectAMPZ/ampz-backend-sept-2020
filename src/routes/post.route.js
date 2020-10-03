import { Router } from 'express';
import PostController from '../controllers/post.controller';
import verifyToken from '../middlewares/auth.middleware';
import postFileUpload from '../services/postImageUpload.service';

const router = Router();

router.get('/', PostController.getPosts);

router.post('/', verifyToken, postFileUpload, PostController.createPost);

export default router;
