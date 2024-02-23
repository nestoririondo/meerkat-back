import express from 'express';
import { createEvent, getEvent, updateEvent, updateParticipants } from '../controllers/events.js';
import { authenticate } from '../middlewares/authenticate.js';

const eventRouter = express.Router();

eventRouter.post('/', createEvent);
eventRouter.get('/:id', authenticate, getEvent);
eventRouter.put('/:id', authenticate, updateEvent);
eventRouter.put('/:id/participants', authenticate, updateParticipants);
// eventRouter.delete('/:id', deleteEvent);

export default eventRouter;
