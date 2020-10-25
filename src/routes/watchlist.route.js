import { Router } from 'express';
import WatchlistController from '../controllers/watchlist.controller';
import verifyToken from '../middlewares/auth.middleware';

const router = Router();

router.post('/:talentId', verifyToken, WatchlistController.addTalent);
router.delete('/:talentId', verifyToken, WatchlistController.removeTalent);
router.get('/', verifyToken, WatchlistController.getTalents);

export default router;
