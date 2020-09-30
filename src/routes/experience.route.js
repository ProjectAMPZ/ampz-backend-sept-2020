import { Router } from "express";
import ExperienceController from "../controllers/experince.controller";
import ExperienceValidator from "../validations/profile/experience.validator";
import verifyToken from "../middlewares/auth.middleware";

const router = Router();

router.post(
  "/experience",
  verifyToken,
  ExperienceValidator.validateData(),
  ExperienceValidator.ValidationResult,
  ExperienceController.createExperience
);

router.put(
  "/experience/:experienceId",
  verifyToken,
  ExperienceController.updateExperience
);

router.get(
  "/experience/:experienceId",
  verifyToken,
  ExperienceController.getExperience
);

router.delete(
  "/experience/:experienceId",
  verifyToken,
  ExperienceController.deleteExperience
);

export default router;
