import { Router } from 'express';
import authRouter from './auth.route';
import bioRouter from './bio.route';
import featureRouter from './feature.route';

const router = Router();

router.use('/auth', authRouter);
router.use('/profile', bioRouter);
router.use('/profile', featureRouter);

export default router;
