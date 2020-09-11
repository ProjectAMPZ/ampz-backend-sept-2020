import { Router } from 'express';
import AuthController from '../controllers/auth.controller';

const router = Router();

router.post('/login', AuthController.login);
router.post('/signup', AuthController.signUp);

export default router;
