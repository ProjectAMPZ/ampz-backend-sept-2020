import { Router } from 'express';
import UserController from '../controllers/user.controller';
import verifyToken from '../middlewares/auth.middleware';

const router = Router();

router.post('/follow/:userId', verifyToken, UserController.followUser);
router.get('/:profileId', UserController.getUser);
router.get('/users/all', UserController.getUsers);
// router.delete('/me/delete/:userId', UserController.deleteUser);

export default router;
