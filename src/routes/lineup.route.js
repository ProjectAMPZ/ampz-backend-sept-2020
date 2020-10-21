import { Router } from 'express';
import LineupController from '../controllers/lineup.controller';
import postFileUpload from '../services/postImageUpload.service';
import verifyToken from '../middlewares/auth.middleware';

const router = Router();

router.post('/', verifyToken, postFileUpload, LineupController.createLineup);
router.delete('/:lineupId', verifyToken, LineupController.deleteLineup);

export default router;
