import express from 'express';
import { getMessages, postMessage, getUnreadMessagesNumber, markMessagesAsRead } from '../controllers/messages.js';
import { authenticate } from '../middlewares/authenticate.js';
import { upload } from '../middlewares/upload.js';

const messageRouter = express.Router();

messageRouter.get('/:id', authenticate, getMessages);
messageRouter.post('/:id', authenticate, upload.single('file'), postMessage);
messageRouter.get('/:id/unread', authenticate, getUnreadMessagesNumber);
messageRouter.put('/:id/read', authenticate, markMessagesAsRead);

export default messageRouter;