import { Router } from 'express';
import LineupController from '../controllers/lineup.controller';
import postFileUpload from '../services/postImageUpload.service';
import verifyToken from '../middlewares/auth.middleware';

const router = Router();

router.post('/', verifyToken, postFileUpload, LineupController.createLineup);
router.put(
  '/:lineupId',
  verifyToken,
  postFileUpload,
  LineupController.updateLineup
);
router.get('/:lineupId', verifyToken, LineupController.getLineup);
router.get('/', verifyToken, LineupController.getLineups);
router.delete('/:lineupId', verifyToken, LineupController.deleteLineup);
router.post(
  '/talent/:talentId',
  verifyToken,
  LineupController.addTalentToLineup
);
router.put('/talent/:talentId', verifyToken, LineupController.updateTalent);
router.delete(
  '/talent/:talentId',
  verifyToken,
  LineupController.removeTalentFromLineup
);
router.get('/talent/all', verifyToken, LineupController.getLineUpTalents);

export default router;
