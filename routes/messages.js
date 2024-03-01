import express from 'express';
import { getMessages, postMessage } from '../controllers/messages.js';
import { authenticate } from '../middlewares/authenticate.js';

const messageRouter = express.Router();

messageRouter.get('/:id', getMessages);
messageRouter.post('/:id', authenticate, postMessage);

export default messageRouter;