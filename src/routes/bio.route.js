import { Router } from 'express';
import BioController from '../controllers/bio.controller';
import BioRoleValidator from '../validations/profile/biorolevalidation';
import verifyToken from '../middlewares/auth.middleware';
import uploadFile from '../services/imageupload.services';

const router = Router();

router.put('/bio', verifyToken, uploadFile, BioController.updateBio);
router.put(
  '/bio/role',
  verifyToken,
  BioRoleValidator.validateData(),
  BioRoleValidator.ValidationResult,
  BioController.updateBioRole
);

export default router;
