import express from 'express';
import { createEvent, getEvent, updateEvent, updateParticipants } from '../controllers/events.js';
import { addAndAssignTodo, checkUncheckTodo, editTodo, deleteTodo } from '../controllers/todos.js';
import { authenticate } from '../middlewares/authenticate.js';
import { checkEventExists } from '../middlewares/events.js';

const eventRouter = express.Router();

eventRouter.post('/', createEvent);
eventRouter.get('/:id', authenticate, getEvent);
eventRouter.put('/:id', authenticate, updateEvent);
eventRouter.put('/:id/participants', authenticate, updateParticipants);
// eventRouter.delete('/:id', deleteEvent);

eventRouter.post('/:id/todos/add', authenticate, checkEventExists, addAndAssignTodo);
eventRouter.put('/:id/todos/:todoId/toggle', authenticate, checkEventExists, checkUncheckTodo);
eventRouter.put('/:id/todos/:todoId/edit', authenticate, checkEventExists, editTodo);
eventRouter.delete('/:id/todos/:todoId', authenticate, checkEventExists, deleteTodo);

export default eventRouter;
