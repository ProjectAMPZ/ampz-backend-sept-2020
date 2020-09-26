import { Router } from 'express';
import BioController from '../controllers/bio.controller';
import verifyToken from '../middlewares/auth.middleware';
import uploadFile from '../services/imageupload.services';

const router = Router();

router.put('/bio', verifyToken, uploadFile, BioController.updateBio);

export default router;
