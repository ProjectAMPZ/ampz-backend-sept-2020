import { Router } from 'express';

import postFileUpload from '../services/postImageUpload.service';
import ChatController from '../controllers/chat.controller';

const router = Router();

router.post('/mediaupload', postFileUpload, ChatController.postChatMedia);

export default router;
