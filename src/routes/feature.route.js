import { Router } from 'express';
import FeatureController from '../controllers/feature.controller';
import FeatureValidator from '../validations/profile/feature.validation';
import verifyToken from '../middlewares/auth.middleware';

const router = Router();

router.post(
  '/feature',
  verifyToken,
  FeatureValidator.validateData(),
  FeatureValidator.ValidationResult,
  FeatureController.createFeature
);

export default router;
