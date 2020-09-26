import { Router } from 'express';
import authRouter from './auth.route';
import bioRouter from './bio.route';

const router = Router();

router.use('/auth', authRouter);
router.use('/profile', bioRouter);

export default router;
