import { Router } from 'express';
import authRouter from './auth.route';
import bioRouter from './bio.route';
import featureRouter from './feature.route';
import experienceRouter from './experience.route';
import achievementRouter from './achievement.route';
import associationRouter from './association.route';
import postRouter from './post.route';
import filterRouter from './filter.route';
import lineupRoute from './lineup.route';
import watchlistRouter from './watchlist.route';
import userRoute from './user.route';


const router = Router();

router.use('/auth', authRouter);
router.use('/profile', bioRouter);
router.use('/profile', featureRouter);
router.use('/profile', experienceRouter);
router.use('/profile', associationRouter);
router.use('/profile', achievementRouter);
router.use('/post', postRouter);
router.use('/filter', filterRouter);
router.use('/lineup', lineupRoute);
router.use('/watchlist', watchlistRouter);
router.use('/user', userRoute);


export default router;
