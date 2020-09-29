import { Router } from 'express';
import BioController from '../controllers/bio.controller';
import BioRoleValidator from '../validations/profile/biorolevalidation';
import verifyToken from '../middlewares/auth.middleware';
import {
  coverPhotoUpload,
  profilePhotoUpload,
} from '../services/imageupload.services';

const router = Router();

router.put('/bio', verifyToken, BioController.updateBio);

router.put(
  '/bio/coverphoto',
  verifyToken,
  coverPhotoUpload,
  BioController.uploadImage
);

router.put(
  '/bio/profilephoto',
  verifyToken,
  profilePhotoUpload,
  BioController.uploadImage
);

router.put(
  '/bio/role',
  verifyToken,
  BioRoleValidator.validateData(),
  BioRoleValidator.ValidationResult,
  BioController.updateBioRole
);

export default router;
