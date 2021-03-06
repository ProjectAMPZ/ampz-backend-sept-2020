import { Router } from 'express';
import ExperienceController from '../controllers/experience.controller';
import ExperienceValidator from '../validations/profile/experience.validator';
import verifyToken from '../middlewares/auth.middleware';

const router = Router();

router.post(
  '/experience',
  verifyToken,
  ExperienceValidator.validateData(),
  ExperienceValidator.ValidationResult,
  ExperienceController.createExperience
);

router.put(
  '/experience/:experienceId',
  verifyToken,
  ExperienceController.updateExperience
);

router.get(
  '/experience/:experienceId',
  verifyToken,
  ExperienceController.getExperience
);

router.delete(
  '/experience/:experienceId',
  verifyToken,
  ExperienceController.deleteExperience
);

router.get(
  '/experience/user/all',
  verifyToken,
  ExperienceController.getUserExperience
);

export default router;
