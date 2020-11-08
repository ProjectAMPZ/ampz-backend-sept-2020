import { Router } from 'express';
import UserController from '../controllers/user.controller';
import verifyToken from '../middlewares/auth.middleware';

const router = Router();

router.put('/follow/:profileId', verifyToken, UserController.followUser);
router.get('/:profileId', UserController.getUser);
router.get('/users/all', UserController.getUsers);

export default router;
