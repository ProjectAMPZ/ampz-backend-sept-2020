import { Router } from 'express';
import FilterController from '../controllers/filter.controller';
import verifyToken from '../middlewares/auth.middleware';

const router = Router();

router.post('/', verifyToken, FilterController.createFilter);
router.put('/:filterId', verifyToken, FilterController.updateFilter);
router.get('/:filterId', verifyToken, FilterController.getFilter);
router.delete('/:filterId', verifyToken, FilterController.deleteFilter);

export default router;
