import { Router } from 'express';
import AchievementController from '../controllers/achievement.controller';
import AchievementValidator from '../validations/profile/achievement.validator';
import verifyToken from '../middlewares/auth.middleware';

const router = Router();

router.post(
  '/achievement',
  verifyToken,
  AchievementValidator.validateData(),
  AchievementValidator.ValidationResult,
  AchievementController.createAchievement
);

router.put(
  '/achievement/:achievementId',
  verifyToken,
  AchievementController.updateAchievement
);

router.get(
  '/achievement/:achievementId',
  verifyToken,
  AchievementController.getAchievement
);

router.delete(
  '/achievement/:achievementId',
  verifyToken,
  AchievementController.deleteAchievement
);

router.get(
  '/achievement/user/all',
  verifyToken,
  AchievementController.getUserAchievement
);

export default router;
