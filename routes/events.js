import express from 'express';
import { createEvent, getEvent, getEvents, updateEvent } from '../controllers/events.js';

const eventRouter = express.Router();

eventRouter.post('/', createEvent);
eventRouter.get('/', getEvents);
eventRouter.get('/:id', getEvent);
eventRouter.put('/:id', updateEvent);
// eventRouter.delete('/:id', deleteEvent);

export default eventRouter;
