import { Router } from "express";
import FeatureController from "../controllers/feature.controller";
import FeatureValidator from "../validations/profile/feature.validation";
import verifyToken from "../middlewares/auth.middleware";

const router = Router();

router.put(
  "/feature/:userId",
  verifyToken,
  FeatureValidator.validateData(),
  FeatureValidator.ValidationResult,
  FeatureController.updateFeature
);

export default router;
