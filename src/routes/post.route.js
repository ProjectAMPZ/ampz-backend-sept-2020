import { Router } from 'express';
import PostController from '../controllers/post.controller';

const router = Router();

router.get('/', PostController.getPosts);

export default router;
