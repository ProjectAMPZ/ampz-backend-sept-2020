import { Router } from 'express';
import AssociationController from '../controllers/association.contoller';
import AssociationValidator from '../validations/profile/association.validation';
import verifyToken from '../middlewares/auth.middleware';

const router = Router();

router.post(
  '/association',
  verifyToken,
  AssociationValidator.validateData(),
  AssociationValidator.ValidationResult,
  AssociationController.createAssociation
);

router.put(
  '/association/:associationId',
  verifyToken,
  AssociationController.updateAssociation
);

router.get(
  '/association/:associationId',
  verifyToken,
  AssociationController.getAssociation
);

router.delete(
  '/association/:associationId',
  verifyToken,
  AssociationController.deleteAssociation
);

export default router;
