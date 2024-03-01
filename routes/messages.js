import express from 'express';
import { getMessages, postMessage, getUnreadMessagesNumber, markMessagesAsRead } from '../controllers/messages.js';
import { authenticate } from '../middlewares/authenticate.js';

const messageRouter = express.Router();

messageRouter.get('/:id', authenticate, getMessages);
messageRouter.post('/:id', authenticate, postMessage);
messageRouter.get('/:id/unread', authenticate, getUnreadMessagesNumber);
messageRouter.put('/:id/read', authenticate, markMessagesAsRead);

export default messageRouter;